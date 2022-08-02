import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo'
import { LoadAnimation } from '../../components/LoadAnimation';
import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../../databases';
import { Alert, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Logo from '../../assets/logo.svg'
import { Car } from '../../components/Car';
import { Car as ModelCar } from '../../databases/model/Car'
import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';
import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList
} from './styles';

export function Home() {
  const navigation = useNavigation<any>()
  const netInfo = useNetInfo()
  const [cars, setCars] = useState<ModelCar[]>([])
  const [loading, setLoading] = useState(true)

  function handleCarDetails(car: ModelCar) {
    navigation.navigate('CarDetails', { car })
  }

  async function offilineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const { data } = await api.get(`/cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`)

        const { changes, latestVersion } = data
        return { changes, timestamp: latestVersion }
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post('/users/sync', user)
      }
    })
  }

  useEffect(() => {
    let isMounted = true

    async function fetchCars() {
      try {
        const carCollection = database.get<ModelCar>('cars')
        const cars = await carCollection.query().fetch()

        if (isMounted)
          setCars(cars)

      } catch (e: any) {
        console.log(e)
      } finally {
        if (isMounted)
          setLoading(false)
      }
    }

    fetchCars()
    return () => {
      isMounted = false
    }

  }, []);

  useEffect(() => {

    if (netInfo.isConnected === true) {
      offilineSynchronize()
    }

  }, [netInfo.isConnected])


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
