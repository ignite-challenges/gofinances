import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, ActivityIndicator } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from 'styled-components/native';

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
  LogoutButton,
  LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
 id: string;
}

interface HighlightProps {
  amount: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const theme = useTheme();
  const isFocused = useIsFocused()

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      const dataKey = '@gofinances:transactions';
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      let entriesTotal = 0;
      let expensiveTotal = 0;

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

          if(transaction.type === "positive") {
            entriesTotal += Number(transaction.amount);
          } else {
            expensiveTotal += Number(transaction.amount);
          }

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

      const total = entriesTotal - expensiveTotal;

      setHighlightData({
        entries:{ 
          amount: entriesTotal
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })
        },
        expensive:{ 
          amount: expensiveTotal
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }) 
        },
        total: {
          amount: total
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }) 
        }
      })

      setTransactions(formattedTransactions);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      Alert.alert('Não foi possivel carregar as transações.');
    }
  }, []);

  useEffect(() =>{ 
    loadTransactions();
  },[loadTransactions, isFocused]);

  return (
    <Container>
      {isLoading ?
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
        :
        <>
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
              amount={highlightData.entries.amount}
              lastTransaction="Última entrada dia 13 de abril"
            />
            <HighlightCard 
              type="down"
              title="Saídas" 
              amount={highlightData.expensive.amount}
              lastTransaction="Última saída dia 03 de abril"
            /> 
            <HighlightCard 
              type="total"
              title="Total" 
              amount={highlightData.total.amount}
              lastTransaction="01 à 06 de abril"
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList 
              data={transactions.reverse()}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} /> }
            />
          </Transactions>
        </>
      }
    </Container>
  )
}
