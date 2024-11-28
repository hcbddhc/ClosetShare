import { View, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//status bar to make sure both ios and android are consistent
  const CustomStatusBar = (
    {
      backgroundColor,
      barStyle = "dark-content",
    }
  ) => { 
        const insets = useSafeAreaInsets();
     return (
       <View style={{ height: insets.top, backgroundColor }}>
          <StatusBar
            animated={true}
            backgroundColor={backgroundColor}
            barStyle={barStyle} />
       </View>
     );
  }

export default CustomStatusBar;