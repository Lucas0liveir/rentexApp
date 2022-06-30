import React from 'react';
import { Button } from 'react-native';
import Animated from 'react-native-reanimated';

import {
    Container
} from './styles';

export function Splash() {
    return (
        <Container>
            <Animated.View />
            <Button title='Mover' onPress={() => { }} />
        </Container>
    );
}