import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants/Colors';

interface BotonProps {
    titulo: string;
    onPress: () => void;
    type?: 'primary' | 'secondary';
}

export const KivaaBoton = ({titulo, onPress, type = 'primary' }: BotonProps) => {
    return(
        <TouchableOpacity onPress={onPress} style={[styles.boton, { backgroundColor: type === 'primary' ? Colors.light.primary : Colors.light.secondary }]}>
            <Text style={styles.texto}>{titulo}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    boton:{
        paddingVertical: 15,
        paddingHorizontal: 70,
        borderRadius: 25, 
        alignItems: 'center',
        marginVertical: 10,
        width:240
    },
    texto:{
        fontFamily: Fonts.bold, 
        fontSize: 16,
        fontWeight: '700',
        color: '#212121',
    }
})