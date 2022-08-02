import React, { useEffect, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { CarDTO } from '../../dtos/CarDTO';
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useTheme } from 'styled-components';

import {
    Container,
    Header,
    CarImages,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    About,
    Accessories,
    Footer,
    OfflineInfo
} from './styles';
import { Car as ModelCar } from '../../databases/model/Car';
import { api } from '../../services/api';
import { useNetInfo } from '@react-native-community/netinfo';

interface Params {
    car: ModelCar
}

export function CarDetails() {
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO)
    const netInfo = useNetInfo()
    const theme = useTheme()
    const navigation = useNavigation<any>()
    const route = useRoute()
    const { car } = route.params as Params

    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y
    })

    const headerStyleAnimation = useAnimatedStyle(() => {
        return {
            height: interpolate(scrollY.value, [0, 200], [200, 70], Extrapolate.CLAMP)
        }
    })

    const sliderCarsStyleAnimation = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollY.value, [0, 150], [1, 0], Extrapolate.CLAMP)
        }
    })

    function hanleConfirmRental() {
        navigation.navigate('Scheduling', { car })
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack()
            return false
        })
    }, [])

    useEffect(() => {

        async function fetchCarUpdated() {
            const response = await api.get(`/cars/${car.id}`)
            setCarUpdated(response.data)
        }

        if (netInfo.isConnected === true)
            fetchCarUpdated()
    }, [netInfo.isConnected])

    return (
        <Container>
            <StatusBar
                barStyle='light-content'
                backgroundColor={'black'}
                translucent
            />
            <Animated.View
                style={[
                    headerStyleAnimation,
                    styles.header,
                    { backgroundColor: theme.colors.background_secondary }
                ]}
            >
                <Header>
                    <BackButton
                        onPress={() => { navigation.goBack() }} />
                </Header>
                <Animated.View
                    style={sliderCarsStyleAnimation}
                >
                    <CarImages>
                        <ImageSlider
                            imageUrl={
                                !!carUpdated.photos ?
                                    carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
                            }
                        />
                    </CarImages>

                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: getStatusBarHeight() + 160,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                <Details>
                    <Description>
                        <Brand>
                            {car.brand}
                        </Brand>
                        <Name>
                            {car.name}
                        </Name>
                    </Description>
                    <Rent>
                        <Period>{car.period}</Period>
                        <Price>R${` ${netInfo.isConnected === true ? car.price : '...'}`}</Price>
                    </Rent>
                </Details>
                {carUpdated.accessories &&
                    <Accessories>
                        {
                            carUpdated.accessories.map((accessory) => <Accessory key={accessory.type} name={accessory.name} icon={getAccessoryIcon(accessory.type)} />)
                        }

                    </Accessories>
                }
                <About>
                    {car.about}
                    {car.about}
                    {car.about}
                    {car.about}
                    {car.about}
                </About>
            </Animated.ScrollView>

            <Footer>
                <Button
                    disabled={netInfo.isConnected === false}
                    onPress={hanleConfirmRental}
                    title='Escolher período do aluguel' />
                {
                    netInfo.isConnected === false &&
                    <OfflineInfo>
                        Conecte-se a Internet para ver mais detalhes e agendar seu carro.
                    </OfflineInfo>
                }
            </Footer>

        </Container>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 1
    },
    back: {
        marginTop: 24
    }
})