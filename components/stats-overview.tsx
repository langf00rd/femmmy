// function StatsOverview() {
//   const { cycles } = useCycles();
//   const colorScheme = useColorScheme();
//   const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

//   const cycleDay = getCurrentCycleDay(cycles);
//   const daysUntil = getDaysUntilNextPeriod(cycles);
//   const predictions = cycles.length > 0 ? getPredictionData(cycles) : null;

//   return (
//     <View>
//       <View>
//         <View style={[{ backgroundColor: colors.background }]}>
//           <Text style={[{ color: colors.tint }]}>{cycleDay}</Text>
//           <Text style={[{ color: colors.icon }]}>Cycle Day</Text>
//         </View>
//         <View style={[{ backgroundColor: colors.background }]}>
//           <Text style={[{ color: colors.tint }]}>{daysUntil}</Text>
//           <Text style={[{ color: colors.icon }]}>Days Until Period</Text>
//         </View>
//       </View>
//       {predictions && (
//         <View>
//           <View style={[{ backgroundColor: colors.background }]}>
//             <Text style={[{ color: colors.success }]}>
//               {format(predictions.nextPeriodDate, "MMM d")}
//             </Text>
//             <Text style={[{ color: colors.icon }]}>Next Period</Text>
//           </View>
//           <View style={[{ backgroundColor: colors.background }]}>
//             <Text style={[{ color: colors.warning }]}>
//               {format(predictions.ovulationDate, "MMM d")}
//             </Text>
//             <Text style={[{ color: colors.icon }]}>Ovulation</Text>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }
