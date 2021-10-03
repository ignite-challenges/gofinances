import styled from 'styled-components/native';
import { FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from 'react-native-responsive-fontsize';
import { 
  GestureHandlerRootView, 
  RectButton 
} from "react-native-gesture-handler";

interface CategoryListProps { 
  key: string; 
  name: string; 
  icon: string; 
  color: string;
}

interface CategoryProps {
  isActive: boolean;
}

export const Container = styled(GestureHandlerRootView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  height: ${RFValue(113)}px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};;
  color: ${({ theme }) => theme.colors.shape};
  font-size: ${RFValue(18)}px;
`;

export const CategoryList = styled(
  FlatList as new () => FlatList<CategoryListProps>)`
    flex: 1;
    width: 100%;
  `;

export const Category = styled(RectButton)<CategoryProps>`
  width: 100%;
  flex-direction: row;
  padding: ${RFValue(15)}px;
  align-items: center;

  background-color: ${({ theme, isActive}) => 
    isActive ? theme.colors.secondary_light : theme.colors.background};
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  margin-right: 16px;
  color: ${({ theme }) => theme.colors.text_dark};
`;

export const Name = styled.Text`
  color: ${({ theme }) => theme.colors.text_dark};
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const Separator = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.title};
`;

export const Footer = styled.View`
  width: 100%;
  padding: 24px;
`;

