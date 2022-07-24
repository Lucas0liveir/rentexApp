import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue
} from 'react-native-reanimated';

import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Logo from '../../assets/logo.svg'
import { Car } from '../../components/Car';
import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';
import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList
} from './styles';
import { LoadAnimation } from '../../components/LoadAnimation';


export function Home() {
  const navigation = useNavigation<any>()
  const [cars, setCars] = useState<CarDTO[]>([])
  const [loading, setLoading] = useState(true)

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car })
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get('/cars')
        setCars(response.data)
      } catch (e: any) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, []);

  return (
    <Container>
      <StatusBar
        barStyle='light-content'
        backgroundColor={'transparent'}
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)}
            height={RFValue(12)}
          />
          {!loading && <TotalCars>
            {`Total de ${cars.length} Carros`}
          </TotalCars>

          }
        </HeaderContent>
      </Header>
      {loading ? <LoadAnimation /> :
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Car onPress={() => handleCarDetails(item)} data={item} />}
        />
      }
    </Container>
  );
}
