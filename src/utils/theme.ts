interface CustomPalette {
    background: Record<string, Record<string, string>>;
    text: Record<string, Record<string, string>>;
    border: Record<string, Record<string, string>>;
    button: Record<string, any>;
    status: Record<string, any>;
}

interface CustomTheme {
    name: string;
    palette: CustomPalette;
}

export const defaultTheme: CustomTheme = {
    name: "default",
    palette: {
        background: {
            primary: {
                primary50: '#E8F8F5',   // Lightest Teal
                primary100: '#D1F2EB',  // Very Light Teal
                primary200: '#A3E4D7',  // Light Teal
                primary300: '#76D7C4',  // Teal 200
                primary400: '#48C9B0',  // Teal 300
                primary500: '#1ABC9C',  // Base Teal
                primary600: '#17A589',  // Teal 600
                primary700: '#148F77',  // Darker Teal
                primary800: '#0E6655',  // Dark Teal
                primary900: '#0B5345',  // Very Dark Teal
                primary950: '#073B32',  // Deepest Teal
                primary960: '#E8F8F5',  // Matching Lightest Teal
            },
            secondary: {
                secondary50: '#FCE9EA',
                secondary100: '#F8D3D5',
                secondary200: '#F2A6AB',
                secondary300: '#EB7A81',
                secondary400: '#E54D57',
                secondary500: '#D31F2B',
                secondary600: '#B21A24',
                secondary700: '#85141B',
                secondary800: '#590D12',
                secondary900: '#2C0709',
                secondary950: '#160305',
            },
            neutral: {
                neutral50: '#F2F2F3',
                neutral100: '#E5E6E6',
                neutral200: '#CACCCE',
                neutral300: '#B0B3B5',
                neutral400: '#96999C',
                neutral500: '#8A8E91',
                neutral600: '#636669',
                neutral700: '#4A4D4F',
                neutral800: '#313335',
                neutral900: '#191A1A',
                neutral950: '#0C0D0D',
                neutral1000: '#F0F0F0'
                
            },
            warning: {
                warning50: '#FDF9E8',
                warning100: '#FBF3D0',
                warning200: '#F7E7A1',
                warning300: '#F3DB72',
                warning400: '#EECF44',
                warning500: '#F7E8A4',
                warning600: '#BB9C11',
                warning700: '#8D750C',
                warning800: '#5E4E08',
                warning900: '#2F2704',
                warning950: '#171402',
            },
            success: {
                success50: '#EFF7EE',
                success100: '#DEEEDD',
                success200: '#BEDEBA',
                success300: '#9DCD98',
                success400: '#7DBC76',
                success500: '#5FAD56',
                success600: '#4A8943',
                success700: '#376732',
                success800: '#254521',
                success900: '#122211',
                success950: '#091108',
            },
            complementary: {
                complementary50: '#E7F6FE',
                complementary100: '#CEECFD',
                complementary200: '#9EDAFA',
                complementary300: '#6DC7F8',
                complementary400: '#3CB5F6',
                complementary500: '#6EC8F8',
                complementary600: '#0982C3',
                complementary700: '#076192',
                complementary800: '#054161',
                complementary900: '#022031',
                complementary950: '#011018',
                complementary960: '#EFF3FF',
            },
            orange: {
                orange50: '#FFEFE6',
                orange100: '#FFE0CC',
                orange200: '#FEC09A',
                orange300: '#FEA167',
                orange400: '#FD8235',
                orange500: '#FD6202',
                orange600: '#CA4F02',
                orange700: '#983B01',
                orange800: '#652701',
                orange900: '#331400',
                orange950: '#190A00',
            },
        },
        text: {
            primary: {
                primary50: '#EAEEFA',
                primary100: '#D6DDF5',
                primary200: '#ADBBEB',
                primary300: '#849AE1',
                primary400: '#5B78D7',
                primary500: '#2743A0',
                primary600: '#2845A4',
                primary700: '#1E347B',
                primary800: '#142252',
                primary900: '#0A1129',
                primary950: '#050915',
                primary960: '#F2F2F2',
                primary1000: '#2B479E'
            },
            secondary: {
                secondary50: '#FCE9EA',
                secondary100: '#F8D3D5',
                secondary200: '#F2A6AB',
                secondary300: '#EB7A81',
                secondary400: '#E54D57',
                secondary500: '#D31F2B',
                secondary600: '#B21A24',
                secondary700: '#85141B',
                secondary800: '#590D12',
                secondary900: '#2C0709',
                secondary950: '#160305',
            },
            neutral: {
                neutral50: '#F2F2F3',
                neutral100: '#E5E6E6',
                neutral200: '#CACCCE',
                neutral300: '#B0B3B5',
                neutral400: '#96999C',
                neutral500: '#8A8E91',
                neutral600: '#636669',
                neutral700: '#4A4D4F',
                neutral800: '#313335',
                neutral900: '#191A1A',
                neutral950: '#0C0D0D',
                neutral960: "#666666",
                neutral970: "#333",
                neutral980: "#4D4D4D",
                neutral990: "#666",
                neutral1000: "#190A00"

            },
            warning: {
                warning50: '#FDF9E8',
                warning100: '#FBF3D0',
                warning200: '#F7E7A1',
                warning300: '#F3DB72',
                warning400: '#EECF44',
                warning500: '#F7E8A4',
                warning600: '#BB9C11',
                warning700: '#8D750C',
                warning800: '#5E4E08',
                warning900: '#2F2704',
                warning950: '#171402',
            },
            success: {
                success50: '#EFF7EE',
                success100: '#DEEEDD',
                success200: '#BEDEBA',
                success300: '#9DCD98',
                success400: '#7DBC76',
                success500: '#5FAD56',
                success600: '#4A8943',
                success700: '#376732',
                success800: '#254521',
                success900: '#122211',
                success950: '#091108',
            },
            complementary: {
                complementary50: '#E7F6FE',
                complementary100: '#CEECFD',
                complementary200: '#9EDAFA',
                complementary300: '#6DC7F8',
                complementary400: '#3CB5F6',
                complementary500: '#6EC8F8',
                complementary600: '#0982C3',
                complementary700: '#076192',
                complementary800: '#054161',
                complementary900: '#022031',
                complementary950: '#011018',
                complementary1000: '#B31920',
            },
            orange: {
                orange50: '#FFEFE6',
                orange100: '#FFE0CC',
                orange200: '#FEC09A',
                orange300: '#FEA167',
                orange400: '#FD8235',
                orange500: '#FD6202',
                orange600: '#CA4F02',
                orange700: '#983B01',
                orange800: '#652701',
                orange900: '#331400',
                orange950: '#190A00',
            },
        },
        border: {
            primary: {
                primary50: '#EAEEFA',
                primary100: '#D6DDF5',
                primary200: '#ADBBEB',
                primary300: '#849AE1',
                primary400: '#5B78D7',
                primary500: '#2743A0',
                primary600: '#2845A4',
                primary700: '#1E347B',
                primary800: '#142252',
                primary900: '#0A1129',
                primary950: '#050915',
                primary960: '#F2F2F2',
            },
            secondary: {
                secondary50: '#FCE9EA',
                secondary100: '#F8D3D5',
                secondary200: '#F2A6AB',
                secondary300: '#EB7A81',
                secondary400: '#E54D57',
                secondary500: '#D31F2B',
                secondary600: '#B21A24',
                secondary700: '#85141B',
                secondary800: '#590D12',
                secondary900: '#2C0709',
                secondary950: '#160305',
            },
            neutral: {
                neutral50: '#F2F2F3',
                neutral100: '#E5E6E6',
                neutral200: '#CACCCE',
                neutral300: '#B0B3B5',
                neutral400: '#96999C',
                neutral500: '#8A8E91',
                neutral600: '#636669',
                neutral700: '#4A4D4F',
                neutral800: '#313335',
                neutral900: '#191A1A',
                neutral950: '#0C0D0D',
                neutral960: "#E6E6E6"
            },
            warning: {
                warning50: '#FDF9E8',
                warning100: '#FBF3D0',
                warning200: '#F7E7A1',
                warning300: '#F3DB72',
                warning400: '#EECF44',
                warning500: '#F7E8A4',
                warning600: '#BB9C11',
                warning700: '#8D750C',
                warning800: '#5E4E08',
                warning900: '#2F2704',
                warning950: '#171402',
            },
            success: {
                success50: '#EFF7EE',
                success100: '#DEEEDD',
                success200: '#BEDEBA',
                success300: '#9DCD98',
                success400: '#7DBC76',
                success500: '#5FAD56',
                success600: '#4A8943',
                success700: '#376732',
                success800: '#254521',
                success900: '#122211',
                success950: '#091108',
            },
            complementary: {
                complementary50: '#E7F6FE',
                complementary100: '#CEECFD',
                complementary200: '#9EDAFA',
                complementary300: '#6DC7F8',
                complementary400: '#3CB5F6',
                complementary500: '#6EC8F8',
                complementary600: '#0982C3',
                complementary700: '#076192',
                complementary800: '#054161',
                complementary900: '#022031',
                complementary950: '#011018',
            },
            orange: {
                orange50: '#FFEFE6',
                orange100: '#FFE0CC',
                orange200: '#FEC09A',
                orange300: '#FEA167',
                orange400: '#FD8235',
                orange500: '#FD6202',
                orange600: '#CA4F02',
                orange700: '#983B01',
                orange800: '#652701',
                orange900: '#331400',
                orange950: '#190A00',
            },
        },
        button: {
            primaryContained: {
                text:{
                    primary50: '#EAEEFA',
                    primary500: '#2743A0',
                },
                border:{
                    primaryLight: "#983B01"
                },
                background:{
                    primary500: '#2743A0',
                    primary700: '#1E347B',
                }
            },
            secondaryContained: {
                text:{
                    primary800: '#142252',
                },
                border:{
                    primary800: '#142252',
                },
                background:{
                    primary100: '#D6DDF5',
                    primary200: '#ADBBEB',
                }
            },
            tertiaryContained: {
                text:{
                    primary800: '#142252',
                    neutral300: '#B0B3B5',
                },
                border:{
                    neutral300: '#B0B3B5',
                },
                background:{
                    primary100: '#D6DDF5',
                    primary200: '#ADBBEB',
                }
            },
            primaryText: {
                text:{
                    primary800: '#142252',
                    neutral300: '#B0B3B5',
                },
                border:{
                    neutral300: '#B0B3B5',
                },
                background:{
                    primary100: '#D6DDF5',
                    primary200: '#ADBBEB',
                }
            },
        },
        status: {
            draft: {
                draft600: '#CA4F02',
                draft100: '#FFE0CC',
                draft50: '#FFEFE6'
            }
        }
    },
};
