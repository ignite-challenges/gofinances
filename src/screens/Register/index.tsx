import React, { useState, useCallback, useEffect } from 'react';
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useForm } from "react-hook-form";
import uuid from "react-native-uuid";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";

import { CategorySelect } from '../CategorySelect';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
} from './styles';
import { useAuth } from '../../hooks/auth';

interface FormData {
  name: string;
  amount: number;
}

type NavigationProps = {
  navigate:(screen:string) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('Preço é obrigatório')
}).required();

export function Register() {
  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema)});
  const { navigate } = useNavigation<NavigationProps>();
  const { user } = useAuth();

  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const handleTransactionTypeSelect = useCallback(
    (type: "positive" | "negative") => {
     setTransactionType(type);
    }, []);

  const handleToggleSelectCategoryModal = useCallback(() => {
    setCategoryModalOpen(state => !state);
  }, []);

  const handleRegister = useCallback(async (form: FormData) => {
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação');

    if(category.key === 'category')
      return Alert.alert('Selecione a categoria');
    
    const newTransaction = ({ 
      id: String(uuid.v4()),
      type: transactionType,
      category: category.key,
      date: new Date(),
      ...form, 
    });

    try {
      const dataKey = `@gofinances:transactions_user${user.id}`;
      const response = await AsyncStorage.getItem(dataKey);
      const currentData = response ? JSON.parse(response) : [];
      const formattedData = [ ...currentData, newTransaction ];
      await AsyncStorage.setItem(dataKey , JSON.stringify(formattedData));
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });
      reset();
      navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel salvar.')
    }
  }, [transactionType, category.key, reset, navigate, user.id]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control} 
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm 
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionTypes>
              <TransactionTypeButton 
                type='up'
                title="Income"
                isActive={transactionType === 'positive'}
                onPress={() => handleTransactionTypeSelect('positive')}
              />
              <TransactionTypeButton 
                type='down'
                title="Outcome"
                isActive={transactionType === 'negative'}
                onPress={() => handleTransactionTypeSelect('negative')}
              />
            </TransactionTypes>
            <CategorySelectButton 
              title={category.name}
              onPress={handleToggleSelectCategoryModal} 
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>
        <Modal visible={categoryModalOpen} transparent>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleToggleSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}