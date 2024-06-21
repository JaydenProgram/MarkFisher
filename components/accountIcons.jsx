import { TouchableOpacity, Image, View } from 'react-native';

const AccountIcon = () => {

    return(
                <Image
                    source={require('../assets/accountIcon.png')} // Adjust the import path as necessary
                    style={{ width: 35, height: 35, borderRadius: 100, }}
                />
        )

};



export default AccountIcon;