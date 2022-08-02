import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons'
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import {
    Container,
    Header,
    CarImages,
    Content,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    RentalPeriod,
    CalendarIcon,
    DateInfo,
    DateTitle,
    DateValue,
    Accessories,
    Footer,
    RentalPrice,
    RentalPriceLabel,
    RentalPriceDetails,
    RentalPriceQuota,
    RentalPriceTotal,
} from './styles';
import { Button } from '../../components/Button';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { Alert, StatusBar } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';


interface Params {
    car: CarDTO;
    dates: string[]
}
interface RentalPeriod {
    start: string;
    end: string
}

export function SchedulingDetails() {
    const theme = useTheme()
    const route = useRoute()
    const netInfo = useNetInfo()
    const navigation = useNavigation<any>()

    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO)
    const [loading, setLoading] = useState(false)
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)

    const { car, dates } = route.params as Params
    const rentTotal = Number(dates.length * car.price)

    async function handleConfirmRental() {
        setLoading(true)

        await api.post(`rentals`, {
            car_id: car.id,
            start_date: new Date(dates[0]),
            end_date: new Date(dates[dates.length - 1]),
            total: rentTotal
        })
            .then(() => navigation.navigate('Confirmation', {
                title: 'Carro alugado!',
                message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`,
                nextScreenRoute: 'Home'
            }))
            .catch(() => {
                setLoading(false)
                Alert.alert('Não foi possível confirmar o agendamento')
            })

    }

    useEffect(() => {
        setRentalPeriod({
            start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
            end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
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
            <Header>
                <BackButton
                    onPress={() => { navigation.goBack() }} />
            </Header>
            <CarImages>
                <ImageSlider
                    imageUrl={
                        !!carUpdated.photos ?
                            carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
                    }
                />
            </CarImages>

            <Content>
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
                        <Price>R$ {car.price}</Price>
                    </Rent>
                </Details>
                <Accessories>
                    {
                        carUpdated.accessories.map((accessory) => <Accessory key={accessory.type} name={accessory.name} icon={getAccessoryIcon(accessory.type)} />)
                    }

                </Accessories>

                <RentalPeriod>
                    <CalendarIcon>
                        <Feather
                            name='calendar'
                            size={RFValue(24)}
                            color={theme.colors.shape}
                        />
                    </CalendarIcon>
                    <DateInfo>
                        <DateTitle>
                            DE
                        </DateTitle>
                        <DateValue>{rentalPeriod.start}</DateValue>
                    </DateInfo>
                    <Feather
                        name='chevron-right'
                        size={RFValue(10)}
                        color={theme.colors.text}
                    />

                    <DateInfo>
                        <DateTitle>
                            ATÉ
                        </DateTitle>
                        <DateValue>{rentalPeriod.end}</DateValue>
                    </DateInfo>
                </RentalPeriod>

                <RentalPrice>
                    <RentalPriceLabel>TOTAL</RentalPriceLabel>
                    <RentalPriceDetails>
                        <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
                        <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
                    </RentalPriceDetails>
                </RentalPrice>
            </Content>

            <Footer>
                <Button
                    onPress={handleConfirmRental}
                    color={theme.colors.success}
                    loading={loading}
                    disabled={loading}
                    title='Alugar agora' />
            </Footer>

        </Container>
    );
}