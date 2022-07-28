import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "../screens/Home";
import { CarDetails } from "../screens/CarDetails";
import { SchedulingDetails } from "../screens/SchedulingDetails";
import { Scheduling } from "../screens/Scheduling";
import { Confirmation } from "../screens/Confirmation";
import { MyCars } from "../screens/MyCars";
import { Splash } from "../screens/Splash";

const { Navigator, Screen } = createStackNavigator()

export function AppStackRoutes() {
    return (
        <Navigator
            initialRouteName="HomeApp"
            screenOptions={{
                headerShown: false
            }}
        >
            <Screen
                name="HomeApp"
                component={Home}
            />
            <Screen
                name="Splash"
                component={Splash}
            />
            <Screen
                name="CarDetails"
                component={CarDetails}
            />
            <Screen
                name="Scheduling"
                component={Scheduling}
            />
            <Screen
                name="SchedulingDetails"
                component={SchedulingDetails}
            />
            <Screen
                name="Confirmation"
                component={Confirmation}
            />
            <Screen
                name="MyCars"
                component={MyCars}
            />
        </Navigator>
    )
}