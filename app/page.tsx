import RentalPropertyCalculator from "./Components/RentalPropertyCalculator";
// import LongTermInvestmentPlan from "./Components/LongTermInvestmentPlan";
export default function Home() {
  return (
    <div className="flex flex-col bg-[#09090B]">
      <RentalPropertyCalculator />
      {/* <LongTermInvestmentPlan /> */}
    </div>
  );
}
