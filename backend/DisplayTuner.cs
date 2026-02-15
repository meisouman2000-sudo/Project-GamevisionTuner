using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Diagnostics;

namespace GameVision.Backend
{
    class DisplayTuner
    {
        // --- GDI Definitions (Brightness/Gamma) ---
        // --- improved GDI declarations ---
        [DllImport("user32.dll")]
        static extern bool EnumDisplayMonitors(IntPtr hdc, IntPtr lprcClip, MonitorEnumDelegate lpfnEnum, IntPtr dwData);

        delegate bool MonitorEnumDelegate(IntPtr hMonitor, IntPtr hdcMonitor, ref Rect lprcMonitor, IntPtr dwData);

        [StructLayout(LayoutKind.Sequential)]
        public struct Rect
        {
            public int left;
            public int top;
            public int right;
            public int bottom;
        }

        [DllImport("gdi32.dll", CharSet = CharSet.Auto)]
        public static extern IntPtr CreateDC(string lpszDriver, string lpszDevice, string lpszOutput, IntPtr lpInitData);

        [DllImport("gdi32.dll")]
        public static extern bool DeleteDC(IntPtr hdc);
        
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern bool GetMonitorInfo(IntPtr hMonitor, ref MonitorInfoEx lpmi);

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
        public struct MonitorInfoEx
        {
            public int Size;
            public Rect Monitor;
            public Rect WorkArea;
            public uint Flags;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)]
            public string DeviceName;
        }

        // --- Restored GDI Definitions ---
        [DllImport("gdi32.dll")]
        public static extern bool SetDeviceGammaRamp(IntPtr hDC, ref RAMP lpRamp);

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
        public struct RAMP
        {
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 256)]
            public UInt16[] Red;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 256)]
            public UInt16[] Green;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 256)]
            public UInt16[] Blue;
        }

        // --- Restored NVAPI Definitions ---
        [DllImport("nvapi64.dll", EntryPoint = "nvapi_QueryInterface", CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr NvAPI_QueryInterface(uint InterfaceId);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int NvAPI_InitializeDelegate();

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int NvAPI_EnumPhysicalGPUsDelegate([Out] IntPtr[] gpuHandles, out uint gpuCount);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int NvAPI_SetDVCLevelDelegate(IntPtr hPhysicalGpu, int viewId, ref NV_DISPLAY_DVC_INFO pDVCInfo);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int NvAPI_GetDVCInfoDelegate(IntPtr hPhysicalGpu, int viewId, ref NV_DISPLAY_DVC_INFO pDVCInfo);

        [StructLayout(LayoutKind.Sequential, Pack = 8)]
        struct NV_DISPLAY_DVC_INFO
        {
            public uint version;
            public int currentLevel;
            public int minLevel;
            public int maxLevel;
            public int defaultLevel;
        }

        const uint NVAPI_Initialize_ID = 0x0150E828; 
        const uint NVAPI_EnumPhysicalGPUs_ID = 0xE5AC921F;
        const uint NVAPI_SetDVCLevel_ID = 0x172409B4;
        const uint NVAPI_GetDVCInfo_ID = 0x4085DE45;

        // --- Additional NVAPI Definitions ---
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int NvAPI_GetAssociatedNvidiaDisplayHandleDelegate(string szDisplayName, out IntPtr pNvDisplayHandle);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int NvAPI_SetDVCLevelExDelegate(IntPtr hNvDisplay, int outputId, ref NV_DISPLAY_DVC_INFO pDVCInfo);

        const uint NVAPI_GetAssociatedNvidiaDisplayHandle_ID = 0x3572C8F7;
        const uint NVAPI_SetDVCLevelEx_ID = 0x4A82C2B1;

        const uint NVAPI_EnumNvidiaDisplayHandle_ID = 0x9ABDD40D;
        
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int NvAPI_EnumNvidiaDisplayHandleDelegate(int thisEnum, ref IntPtr pNvDisplayHandle);

        static NvAPI_InitializeDelegate NvInit;
        static NvAPI_EnumPhysicalGPUsDelegate NvEnumGPUs;
        static NvAPI_SetDVCLevelDelegate NvSetDVC;
        static NvAPI_GetDVCInfoDelegate NvGetDVC;
        static NvAPI_GetAssociatedNvidiaDisplayHandleDelegate NvGetDisplayHandle;
        static NvAPI_SetDVCLevelExDelegate NvSetDVCEx;
        static NvAPI_EnumNvidiaDisplayHandleDelegate NvEnumNvidiaDisplayHandle;

        public static void Main(string[] args)
        {
            // Default Values
            int brightness = 50; 
            double gamma = 1.0;  
            int contrast = 50;   
            int vibrance = -1;    

            // Parse Args
            bool readMode = false;

            for (int i = 0; i < args.Length; i++)
            {
                switch (args[i])
                {
                    case "--read":
                        readMode = true;
                        break;
                    case "--brightness":
                        if (i + 1 < args.Length) brightness = int.Parse(args[++i]);
                        break;
                    case "--gamma":
                        if (i + 1 < args.Length) gamma = double.Parse(args[++i], System.Globalization.CultureInfo.InvariantCulture);
                        break;
                    case "--contrast":
                        if (i + 1 < args.Length) contrast = int.Parse(args[++i]);
                        break;
                    case "--vibrance":
                        if (i + 1 < args.Length) vibrance = int.Parse(args[++i]);
                        break;
                }
            }

            if (readMode)
            {
                ReadSettings();
                return;
            }

            Console.WriteLine("[DisplayTuner] Settings: Brightness=" + brightness + ", Gamma=" + gamma + ", Contrast=" + contrast + ", Vibrance=" + vibrance);

            string primaryDeviceName = null;

            // 1. Apply GDI and Find Primary Monitor Name
            EnumDisplayMonitors(IntPtr.Zero, IntPtr.Zero, delegate (IntPtr hMonitor, IntPtr hdcMonitor, ref Rect lprcMonitor, IntPtr dwData)
            {
                MonitorInfoEx mi = new MonitorInfoEx();
                mi.Size = Marshal.SizeOf(mi);
                if (GetMonitorInfo(hMonitor, ref mi))
                {
                    // Check if Primary Monitor (Flag 1)
                    if ((mi.Flags & 1) != 0)
                    {
                        primaryDeviceName = mi.DeviceName;
                        Console.WriteLine("Applying to PRIMARY monitor: " + mi.DeviceName);
                        // Create DC for specific monitor
                        IntPtr hDC = CreateDC(null, mi.DeviceName, null, IntPtr.Zero);
                        if (hDC != IntPtr.Zero)
                        {
                             SetGamma(hDC, brightness, gamma, contrast);
                             DeleteDC(hDC);
                        }
                    }
                }
                return true;
            }, IntPtr.Zero);
            
            Console.WriteLine("GDI Settings Applied to Primary Monitor.");

            // 2. Apply NvAPI (Digital Vibrance) if we found a primary monitor
            if (vibrance >= 0 && !string.IsNullOrEmpty(primaryDeviceName))
            {
                ApplyNvSettings(vibrance, primaryDeviceName);
            }
            else if (vibrance >= 0)
            {
                Console.WriteLine("Could not identify Primary Monitor for NvAPI. Trying default.");
                ApplyNvSettings(vibrance, null); 
            }
        }

        static void SetGamma(IntPtr hDC, int brightness, double gamma, int contrast)
        {
            // ... (Existing SetGamma Logic, omitted for brevity, logic remains same)
            RAMP ramp = new RAMP();
            ramp.Red = new ushort[256];
            ramp.Green = new ushort[256];
            ramp.Blue = new ushort[256];

            if (brightness == 50 && Math.Abs(gamma - 1.0) < 0.01 && contrast == 50)
            {
                for (int i = 0; i < 256; i++)
                {
                     ushort val = (ushort)((i / 255.0) * 65535);
                     ramp.Red[i] = val; ramp.Green[i] = val; ramp.Blue[i] = val;
                }
                SetDeviceGammaRamp(hDC, ref ramp);
                return;
            }

            for (int i = 0; i < 256; i++)
            {
                double v = i / 255.0;
                if (gamma < 0.2) gamma = 0.2; if (gamma > 4.0) gamma = 4.0;
                v = Math.Pow(v, 1.0 / gamma);
                double c = (contrast + 50) / 100.0;
                v = (v - 0.5) * c + 0.5;
                double b = (brightness - 50) / 200.0;
                v = v + b;
                if (v < 0) v = 0; if (v > 1) v = 1;
                ushort val = (ushort)(v * 65535);
                ramp.Red[i] = val; ramp.Green[i] = val; ramp.Blue[i] = val;
            }
            SetDeviceGammaRamp(hDC, ref ramp);
        }

        static void ApplyNvSettings(int vibrancePercent, string targetDeviceName)
        {
            // Load Functions
            IntPtr ptrInit = NvAPI_QueryInterface(NVAPI_Initialize_ID);
            if (ptrInit == IntPtr.Zero) throw new Exception("NvAPI_Initialize not found");
            NvInit = Marshal.GetDelegateForFunctionPointer<NvAPI_InitializeDelegate>(ptrInit);

            // Initialize
            if (NvInit() != 0) throw new Exception("NvAPI Init Failed");

            NV_DISPLAY_DVC_INFO info = new NV_DISPLAY_DVC_INFO();
            info.version = (uint)(Marshal.SizeOf(typeof(NV_DISPLAY_DVC_INFO)) | (0x10000)); 
            
            int apiValue = vibrancePercent;
            if (apiValue < 0) apiValue = 0;
            if (apiValue > 100) apiValue = 100;
            info.currentLevel = apiValue; 

            Console.WriteLine("Targeting Primary Monitor: " + (targetDeviceName ?? "Unknown"));

            // Get Pointers
            IntPtr ptrGetDisplay = NvAPI_QueryInterface(NVAPI_GetAssociatedNvidiaDisplayHandle_ID);
            IntPtr ptrSetDVCEx = NvAPI_QueryInterface(NVAPI_SetDVCLevelEx_ID);
            IntPtr ptrEnumDisplays = NvAPI_QueryInterface(NVAPI_EnumNvidiaDisplayHandle_ID);

            if (ptrEnumDisplays != IntPtr.Zero && ptrSetDVCEx != IntPtr.Zero)
            {
                NvEnumNvidiaDisplayHandle = Marshal.GetDelegateForFunctionPointer<NvAPI_EnumNvidiaDisplayHandleDelegate>(ptrEnumDisplays);
                NvSetDVCEx = Marshal.GetDelegateForFunctionPointer<NvAPI_SetDVCLevelExDelegate>(ptrSetDVCEx);
                
                // If GetAssociated works, use it.
                if (!string.IsNullOrEmpty(targetDeviceName) && ptrGetDisplay != IntPtr.Zero) 
                {
                     NvGetDisplayHandle = Marshal.GetDelegateForFunctionPointer<NvAPI_GetAssociatedNvidiaDisplayHandleDelegate>(ptrGetDisplay);
                     IntPtr hDisplay;
                     if (NvGetDisplayHandle(targetDeviceName, out hDisplay) == 0)
                     {
                         Console.WriteLine("[NvAPI] Found Handle via Name. Applying...");
                         NvSetDVCEx(hDisplay, 0, ref info);
                         return;
                     }
                     Console.WriteLine("[NvAPI] Direct connection failed. Trying enumeration...");
                }

                // Fallback: Iterate ALL NvDisplays and try to guess?
                // Or if targetDeviceName is null, apply to all.
                // But we want to target PRIMARY.
                // Enumeration doesn't give us the GDI Name easily without another call.
                // Let's rely on GetAssociatedNvidiaDisplayHandle behaving correctly if we pass the right string.
                // If it failed above, let's try a fallback to the "First NvDisplay" found (Handle #0).
                
                IntPtr hDisplayEnum = IntPtr.Zero;
                if (NvEnumNvidiaDisplayHandle(0, ref hDisplayEnum) == 0) // Index 0
                {
                    Console.WriteLine("[NvAPI] Applying to First Enumerated Display Handle (Fallback).");
                    NvSetDVCEx(hDisplayEnum, 0, ref info);
                    return;
                }
            }

            // Absolute Fallback: Legacy Global
            Console.WriteLine("[NvAPI] Using Legacy Global Fallback.");
            IntPtr ptrEnum = NvAPI_QueryInterface(NVAPI_EnumPhysicalGPUs_ID);
            if (ptrEnum == IntPtr.Zero) return;
            NvEnumGPUs = Marshal.GetDelegateForFunctionPointer<NvAPI_EnumPhysicalGPUsDelegate>(ptrEnum);

            IntPtr ptrSetDVC = NvAPI_QueryInterface(NVAPI_SetDVCLevel_ID);
            if (ptrSetDVC == IntPtr.Zero) return;
            NvSetDVC = Marshal.GetDelegateForFunctionPointer<NvAPI_SetDVCLevelDelegate>(ptrSetDVC);

            IntPtr[] handles = new IntPtr[64];
            uint count = 0;
            if (NvEnumGPUs(handles, out count) != 0 || count == 0) return;

            NvSetDVC(handles[0], 0, ref info);
        }

        static void ReadSettings()
        {
            // Default "Safe" Values in case of failure
            int currentVibrance = 50; 
            // We cannot easily read GDI Brightness/Contrast/Gamma as high-level values. 
            // So we return standard defaults for those, but try to get actual Vibrance.

            try
            {
                // Init NvAPI
                IntPtr ptrInit = NvAPI_QueryInterface(NVAPI_Initialize_ID);
                if (ptrInit != IntPtr.Zero)
                {
                    NvInit = Marshal.GetDelegateForFunctionPointer<NvAPI_InitializeDelegate>(ptrInit);
                    if (NvInit() == 0)
                    {
                        // Get Vibrance
                        NV_DISPLAY_DVC_INFO info = new NV_DISPLAY_DVC_INFO();
                        info.version = (uint)(Marshal.SizeOf(typeof(NV_DISPLAY_DVC_INFO)) | (0x10000));

                        IntPtr ptrEnum = NvAPI_QueryInterface(NVAPI_EnumPhysicalGPUs_ID);
                        IntPtr ptrGetDVC = NvAPI_QueryInterface(NVAPI_GetDVCInfo_ID);

                        if (ptrEnum != IntPtr.Zero && ptrGetDVC != IntPtr.Zero)
                        {
                            NvEnumGPUs = Marshal.GetDelegateForFunctionPointer<NvAPI_EnumPhysicalGPUsDelegate>(ptrEnum);
                            NvGetDVC = Marshal.GetDelegateForFunctionPointer<NvAPI_GetDVCInfoDelegate>(ptrGetDVC);

                            IntPtr[] handles = new IntPtr[64];
                            uint count = 0;
                            if (NvEnumGPUs(handles, out count) == 0 && count > 0)
                            {
                                // Read from first GPU
                                if (NvGetDVC(handles[0], 0, ref info) == 0)
                                {
                                    currentVibrance = info.currentLevel;
                                }
                            }
                        }
                    }
                }
            }
            catch { /* Ignore errors, use defaults */ }

            // Output JSON-like format
            Console.WriteLine("{ \"brightness\": 50, \"contrast\": 50, \"gamma\": 1.0, \"vibrance\": " + currentVibrance + " }");
        }
    }
}

