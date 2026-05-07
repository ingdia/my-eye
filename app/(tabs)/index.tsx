import {
  AlertTriangle,
  Camera,
  MapPin,
  Settings,
  Wifi
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function EMboniApp() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0B1020", padding: 20 }}>
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          marginTop: 40,
        }}
      >
        E-mboni
      </Text>
      <Text style={{ color: "#A0AEC0", fontSize: 16, marginTop: 8 }}>
        AI wearable assistance for safer mobility
      </Text>

      <View
        style={{
          backgroundColor: "#151B2F",
          padding: 20,
          borderRadius: 20,
          marginTop: 30,
        }}
      >
        <Camera color="white" size={28} />
        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "600",
            marginTop: 12,
          }}
        >
          Live Detection
        </Text>
        <Text style={{ color: "#94A3B8", marginTop: 8 }}>
          Connected wearable camera scanning nearby obstacles in real time.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#2563EB",
            padding: 14,
            borderRadius: 14,
            marginTop: 18,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            Start Monitoring
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 25,
        }}
      >
        <View
          style={{
            backgroundColor: "#151B2F",
            width: "48%",
            padding: 18,
            borderRadius: 18,
          }}
        >
          <AlertTriangle color="white" size={24} />
          <Text style={{ color: "white", marginTop: 10, fontSize: 18 }}>
            Obstacle Alerts
          </Text>
          <Text style={{ color: "#94A3B8", marginTop: 6 }}>
            Immediate vibration & sound warnings
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#151B2F",
            width: "48%",
            padding: 18,
            borderRadius: 18,
          }}
        >
          <Wifi color="white" size={24} />
          <Text style={{ color: "white", marginTop: 10, fontSize: 18 }}>
            Device Status
          </Text>
          <Text style={{ color: "#94A3B8", marginTop: 6 }}>
            Wearable connected successfully
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#151B2F",
          padding: 20,
          borderRadius: 20,
          marginTop: 25,
        }}
      >
        <MapPin color="white" size={24} />
        <Text style={{ color: "white", fontSize: 20, marginTop: 10 }}>
          Navigation Assistance
        </Text>
        <Text style={{ color: "#94A3B8", marginTop: 8 }}>
          Indoor and outdoor path guidance for visually impaired users.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#151B2F",
          padding: 20,
          borderRadius: 20,
          marginTop: 25,
          marginBottom: 40,
        }}
      >
        <Settings color="white" size={24} />
        <Text style={{ color: "white", fontSize: 20, marginTop: 10 }}>
          Accessibility Settings
        </Text>
        <Text style={{ color: "#94A3B8", marginTop: 8 }}>
          Customize alert intensity, voice guidance, and emergency contact
          options.
        </Text>
      </View>
    </ScrollView>
  );
}
