const commonColor = {
    colors: {
        commonWhite: '#FFFFFF',
        commonBlack: '#000000',
    },
};

// Light theme colors
const light = {
    colors: {
        background: '#2eb887',
        text: '#434d66',
        icon: '#434d66',
        mapMarker: require('../../assets/smallMapMarker.png'),
        ...commonColor.colors,
    },
};

// Dark theme colors
const dark = {
    colors: {
        background: '#434d66',
        text: '#2eb887',
        icon: '#2eb887',
        mapMarker: require('../../assets/darkMapMarker.png'),
        ...commonColor.colors,

    },
};

// Export themes
export { light, dark };
