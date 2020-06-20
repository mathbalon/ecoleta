import React, { useState, useEffect } from 'react'
import RNPickerSelect from 'react-native-picker-select'
import { StyleSheet, View, Image, Text, ImageBackground } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import apiIBGE from '../../services/apiIBGE'

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

interface UfItemsSelect {
  label: string,
  value: string
}

interface CityItemsSelect {
  label: string,
  value: string
}

const Home = () => {
  const [ufs, setUfs] = useState<UfItemsSelect[]>([])
  const [cities, setCities] = useState<CityItemsSelect[]>([])

  const [selectedUf, setSelectedUf] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)

  const navigation = useNavigation()

  useEffect(() => {
    apiIBGE
      .get<IBGEUFResponse[]>('')
      .then(resp => {
        const ufInitials = resp.data.map(uf => {
          return {
            label: uf.sigla,
            value: uf.sigla
          }
        })

        setUfs(ufInitials)
      })
  }, [])

  useEffect(() => {
    if (selectedUf === null) return

    setSelectedCity(null)

    apiIBGE
      .get<IBGECityResponse[]>(`${selectedUf}/municipios`)
      .then(resp => {
        const cityNames = resp.data.map(city => {
          return {
            label: city.nome,
            value: city.nome
          }
        })

        setCities(cityNames)
      })
  }, [selectedUf])

  function handleNavigatePoints() {
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity })
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={{
            label: 'Selecione a UF',
            value: null,
          }}
          value={selectedUf}
          onValueChange={(value) => setSelectedUf(value)}
          items={ufs}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={{
            label: 'Selecione a Cidade',
            value: null,
          }}
          value={selectedCity}
          onValueChange={(value) => setSelectedCity(value)}
          items={cities}
        />

        <RectButton style={styles.button} onPress={handleNavigatePoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#FFF" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  }
})

export default Home