import { useWindowDimensions } from 'react-native';

// Universal device categories that work for both iPhone and Android
export interface DeviceInfo {
    category: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'tablet';
    isPhone: boolean;
    isTablet: boolean;
    scale: number; // Scaling factor for sizing
}

export const useUniversalResponsive = (): DeviceInfo => {
    const { width, height } = useWindowDimensions();

    // Universal breakpoints that work for both iOS and Android
    if (width >= 768) {
        return {
            category: 'tablet',
            isPhone: false,
            isTablet: true,
            scale: 1.6, // 60% larger elements
        };
    }

    if (width >= 428) {
        return {
            category: 'xl', // iPhone Pro Max, large Android phones
            isPhone: true,
            isTablet: false,
            scale: 1.3, // 30% larger elements
        };
    }

    if (width >= 390) {
        return {
            category: 'lg', // iPhone 14, most flagship Android phones
            isPhone: true,
            isTablet: false,
            scale: 1.15, // 15% larger elements
        };
    }

    if (width >= 360) {
        return {
            category: 'md', // iPhone 12/13, standard Android phones
            isPhone: true,
            isTablet: false,
            scale: 1.0, // Base size
        };
    }

    if (width >= 320) {
        return {
            category: 'sm', // iPhone SE, small Android phones
            isPhone: true,
            isTablet: false,
            scale: 0.9, // 10% smaller elements
        };
    }

    // Extra small (very old or compact devices)
    return {
        category: 'xs',
        isPhone: true,
        isTablet: false,
        scale: 0.8, // 20% smaller elements
    };
};

// Responsive sizing utilities
export const getResponsiveSize = (baseSize: number, deviceInfo: DeviceInfo): number => {
    return Math.round(baseSize * deviceInfo.scale);
};

export const getResponsivePadding = (basePadding: number, deviceInfo: DeviceInfo): number => {
    return Math.round(basePadding * deviceInfo.scale);
};

export const getResponsiveFontSize = (baseFontSize: number, deviceInfo: DeviceInfo): number => {
    // Font scaling is more conservative than element scaling
    const fontScale = Math.min(deviceInfo.scale, 1.3); // Cap at 30% increase
    return Math.round(baseFontSize * fontScale);
};

// Comprehensive device support mapping
export const DEVICE_SUPPORT = {
    // iPhone models
    'iPhone SE (2020/2022)': { width: 375, height: 667, category: 'sm' },
    'iPhone 12 mini/13 mini': { width: 375, height: 812, category: 'md' },
    'iPhone 12/13/14': { width: 390, height: 844, category: 'lg' },
    'iPhone 12/13/14 Plus': { width: 428, height: 926, category: 'xl' },
    'iPhone 12/13/14 Pro Max': { width: 428, height: 926, category: 'xl' },

    // Popular Android models
    'Galaxy S21/S22/S23': { width: 360, height: 800, category: 'md' },
    'Galaxy S21+/S22+/S23+': { width: 384, height: 854, category: 'lg' },
    'Galaxy S21 Ultra/S22 Ultra': { width: 412, height: 915, category: 'xl' },
    'Pixel 6/7/8': { width: 411, height: 914, category: 'xl' },
    'Pixel 6a/7a': { width: 393, height: 851, category: 'lg' },
    'OnePlus 9/10/11': { width: 412, height: 919, category: 'xl' },
    'Xiaomi Mi/Redmi series': { width: 393, height: 873, category: 'lg' },

    // Foldables
    'Galaxy Z Fold (unfolded)': { width: 673, height: 841, category: 'tablet' },
    'Pixel Fold (unfolded)': { width: 673, height: 840, category: 'tablet' },

    // Tablets
    'iPad': { width: 768, height: 1024, category: 'tablet' },
    'iPad Pro': { width: 1024, height: 1366, category: 'tablet' },
    'Galaxy Tab': { width: 800, height: 1280, category: 'tablet' },
} as const; 