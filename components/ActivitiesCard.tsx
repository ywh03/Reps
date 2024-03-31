import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import Colors from "@/constants/Colors";

export default function ActivitiesCard(props: {activityType: string, activityKeyStat: string, activityDate: string}) {
    return (
        <View>
            <Text>{props.activityType}</Text>
            <Text>{props.activityKeyStat}</Text>
            <Text>{props.activityDate}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    activitiesCard: {
        backgroundColor: Colors.custom.background,
    }
})