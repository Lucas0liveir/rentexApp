import React from 'react';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
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
    About,
    Accessories,
    Footer
} from './styles';
import { CarDTO } from '../../dtos/CarDTO';

interface Params {
    car: CarDTO
}
export function CarDetails() {

    const navigation = useNavigation<any>()
    const route = useRoute()
    const { car } = route.params as Params

    function hanleConfirmRental() {
        navigation.navigate('Scheduling', { car })
    }

    return (
        <Container>
            <Header>
                <BackButton
                    onPress={() => { navigation.goBack() }} />
            </Header>
            <CarImages>
                <ImageSlider
                    imageUrl={car.photos}
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
                        <Period>{car.rent.period}</Period>
                        <Price>R${` ${car.rent.price}`}</Price>
                    </Rent>
                </Details>
                <Accessories>
                    {
                        car.accessories.map((accessory) => <Accessory key={accessory.type} name={accessory.name} icon={getAccessoryIcon(accessory.type)} />)
                    }


                </Accessories>
                <About>{car.about}</About>
            </Content>

            <Footer>
                <Button onPress={hanleConfirmRental} title='Escolher período do aluguel' />
            </Footer>

        </Container>
    );
}