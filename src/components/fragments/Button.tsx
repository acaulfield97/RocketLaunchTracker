// import {forwardRef} from 'react';
// import {Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';
// import styles from '../styles/styles';

// type ButtonProps = {
//   onPress?: TouchableOpacityProps['onPress'];
//   title?: string;
// } & TouchableOpacityProps;

// export const Button = forwardRef<TouchableOpacity, ButtonProps>(
//   ({onPress, title, ...otherProps}, ref) => {
//     return (
//       <TouchableOpacity
//         ref={ref}
//         style={[
//           styles.button,
//           {backgroundColor: otherProps.disabled ? 'gray' : 'limegreen'},
//         ]}
//         onPress={onPress}
//         // spreads all other props that are passed to Button component to TouchableOpacity, ensuring that all standard TouchableOpacity props are properly forwarded.
//         {...otherProps}>
//         <Text style={styles.buttonText}>{title}</Text>
//       </TouchableOpacity>
//     );
//   },
// );
