import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import { HighlightCard } from "../../components/HighlightCard";
import { 
  TransactionCard, 
  TransactionCardProps 
} from "../../components/TransactionCard";

import { 
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton
} from './styles'

export interface DataListProps extends TransactionCardProps {
 id: string;
}

export function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([]);

  const loadTransactions = useCallback(async () => {
    try {
      const dataKey = '@gofinances:transactions';
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      const formattedTransactions: DataListProps[] = transactions.map(
        (transaction: DataListProps) => {
          const amount = Number(transaction.amount)
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            });

          const date = Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: '2-digit', 
           }).format(new Date(transaction.date));

          return {
            id: transaction.id,
            name: transaction.name,
            type: transaction.type,
            category: transaction.category,
            amount,
            date
          };
        }
      );

      setData(formattedTransactions);
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel carregar as transações.')
    }
  }, []);

  useEffect(() =>{ 
    loadTransactions();
  },[loadTransactions])

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/37402298?s=400&u=f6aa0e04f01bfe58f6e0e7acfc32b2735f8821fa&v=4'}} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Tiago</UserName>
            </User>
          </UserInfo>
          <LogoutButton>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard 
          type="up"
          title="Entradas" 
          amount="R$ 17.400,00"  
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard 
          type="down"
          title="Saídas" 
          amount="R$ 1.259,00"  
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard 
          type="total"
          title="Total" 
          amount="R$ 16.141,00"  
          lastTransaction="01 à 06 de abril"
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionList 
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} /> }
        />
      </Transactions>
    </Container>
  )
}
