/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
const RentalPropertyCalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState(250000);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20);
  const [interestRate, setInterestRate] = useState(5);
  const [mortgageTerm, setMortgageTerm] = useState(25);
  const [monthlyRent, setMonthlyRent] = useState(1800);

  const [propertyTaxType, setPropertyTaxType] = useState("percentage");
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.5);
  const [propertyTaxAmount, setPropertyTaxAmount] = useState(3750);

  const [insuranceType, setInsuranceType] = useState("percentage");
  const [insuranceRate, setInsuranceRate] = useState(0.4);
  const [insuranceAmount, setInsuranceAmount] = useState(1000);

  const [maintenanceType, setMaintenanceType] = useState("percentage");
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [maintenanceAmount, setMaintenanceAmount] = useState(2500);

  const [condoFees, setCondoFees] = useState(0);

  const [vacancyType, setVacancyType] = useState("percentage");
  const [vacancyRate, setVacancyRate] = useState(5);
  const [vacancyAmount, setVacancyAmount] = useState(1080);

  const [monthlyMortgage, setMonthlyMortgage] = useState(0);
  const [totalMonthlyCosts, setTotalMonthlyCosts] = useState(0);
  const [netCashFlow, setNetCashFlow] = useState(0);

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    console.log(properties);
  }, [properties]);

  useEffect(() => {
    const downPayment = propertyPrice * (downPaymentPercentage / 100);
    const loanAmount = propertyPrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = mortgageTerm * 12;

    const monthlyMortgagePayment =
      (loanAmount *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const propertyTax =
      propertyTaxType === "percentage"
        ? (propertyPrice * (propertyTaxRate / 100)) / 12
        : propertyTaxAmount / 12;

    const insurance =
      insuranceType === "percentage"
        ? (propertyPrice * (insuranceRate / 100)) / 12
        : insuranceAmount / 12;

    const maintenance =
      maintenanceType === "percentage"
        ? (propertyPrice * (maintenanceRate / 100)) / 12
        : maintenanceAmount / 12;

    const vacancy =
      vacancyType === "percentage"
        ? monthlyRent * (vacancyRate / 100)
        : vacancyAmount / 12;

    const totalCosts =
      monthlyMortgagePayment +
      propertyTax +
      insurance +
      maintenance +
      vacancy +
      condoFees;
    const cashFlow = monthlyRent - totalCosts;

    setMonthlyMortgage(monthlyMortgagePayment);
    setTotalMonthlyCosts(totalCosts);
    setNetCashFlow(cashFlow);
  }, [
    propertyPrice,
    downPaymentPercentage,
    interestRate,
    mortgageTerm,
    monthlyRent,
    propertyTaxType,
    propertyTaxRate,
    propertyTaxAmount,
    insuranceType,
    insuranceRate,
    insuranceAmount,
    maintenanceType,
    maintenanceRate,
    maintenanceAmount,
    vacancyType,
    vacancyRate,
    vacancyAmount,
    condoFees,
  ]);

  const addProperty = () => {
    const newProperty = {
      propertyPrice,
      downPaymentPercentage,
      interestRate,
      mortgageTerm,
      monthlyRent,
      propertyTaxType,
      propertyTaxRate,
      propertyTaxAmount,
      insuranceType,
      insuranceRate,
      insuranceAmount,
      maintenanceType,
      maintenanceRate,
      maintenanceAmount,
      condoFees,
      vacancyType,
      vacancyRate,
      vacancyAmount,
      monthlyMortgage,
      totalMonthlyCosts,
      netCashFlow,
    };
    setProperties((prevProperties) => [...prevProperties, newProperty]);
  };

  const ResultsSection = () => {
    const chartResultsConfig = {
      monthlyRent: {
        label: "Monthly Rent",
        color: "#2662D9",
      },
      totalCosts: {
        label: "Total Costs",
        color: "hsl(var(--chart-1))",
      },
      netCashFlow: {
        label: "Net Cash Flow",
        color: "hsl(var(--chart-1))",
      },
    };
    const [growthPeriod, setGrowthPeriod] = useState("10");

    const chartData = [
      { name: "Monthly Rent", value: monthlyRent },
      { name: "Total Costs", value: totalMonthlyCosts },
      { name: "Net Cash Flow", value: netCashFlow },
    ];

    const calculateGrowth = (years) => {
      let data = [];
      for (let i = 0; i <= years; i++) {
        const totalRent = monthlyRent * 12 * i;
        const totalCosts = totalMonthlyCosts * 12 * i;
        const totalProfit = netCashFlow * 12 * i;
        data.push({
          year: i,
          "Total Rent": totalRent,
          "Total Costs": totalCosts.toFixed(2),
          "Total Profit": totalProfit.toFixed(2),
        });
      }
      return data;
    };

    const growthData = calculateGrowth(parseInt(growthPeriod));

    return (
      <Card className="">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold">
              Monthly Mortgage Payment : ${monthlyMortgage.toFixed(2)}
            </h3>
            <ul className="list-disc list-inside text-sm">
              <li>
                Loan Amount: $
                {(
                  propertyPrice -
                  (propertyPrice * downPaymentPercentage) / 100
                ).toFixed(2)}
              </li>
              <li>
                Monthly Interest Rate: {(interestRate / 12 / 100).toFixed(4)}%
              </li>
              <li>Term in Months: {mortgageTerm * 12}</li>
            </ul>

            <div>
              <h3 className="font-semibold">
                Total Monthly Costs : ${totalMonthlyCosts.toFixed(2)}
              </h3>
              <p className="text-xs text-gray-600 py-1">
                Calculated as: Monthly Mortgage + Property Tax + Insurance +
                Maintenance + Vacancy + Condo Fees
              </p>
              <ul className="list-disc list-inside text-sm">
                <li>Monthly Mortgage: ${monthlyMortgage.toFixed(2)}</li>
                <li>
                  Property Tax: $
                  {(propertyTaxType === "percentage"
                    ? (propertyPrice * propertyTaxRate) / 100 / 12
                    : propertyTaxAmount / 12
                  ).toFixed(2)}
                </li>
                <li>
                  Insurance: $
                  {(insuranceType === "percentage"
                    ? (propertyPrice * insuranceRate) / 100 / 12
                    : insuranceAmount / 12
                  ).toFixed(2)}
                </li>
                <li>
                  Maintenance: $
                  {(maintenanceType === "percentage"
                    ? (propertyPrice * maintenanceRate) / 100 / 12
                    : maintenanceAmount / 12
                  ).toFixed(2)}
                </li>
                <li>
                  Vacancy: $
                  {(vacancyType === "percentage"
                    ? (monthlyRent * vacancyRate) / 100
                    : vacancyAmount / 12
                  ).toFixed(2)}
                </li>
                <li>Condo Fees: ${condoFees.toFixed(2)}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">
                Net Cash Flow : ${netCashFlow.toFixed(2)}
              </h3>
              <p className="text-sm text-gray-600">
                Calculation: Monthly Rent - Total Monthly Costs
              </p>
              <ul className="list-disc list-inside text-sm">
                <li>Monthly Rent: ${monthlyRent.toFixed(2)}</li>
                <li>Total Monthly Costs: ${totalMonthlyCosts.toFixed(2)}</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Monthly Breakdown</h3>
            <div className="">
              <Card>
                <ChartContainer config={chartResultsConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={true}
                      tickMargin={8}
                    />
                    <YAxis
                      dataKey="value"
                      tickLine={false}
                      axisLine={true}
                      tickMargin={8}
                      tickFormatter={(value) => `$${value}`}
                      tickCount={10}
                    />
                    <ChartTooltip
                      cursor={true}
                      content={<ChartTooltipContent />}
                    />

                    <Bar
                      dataKey="value"
                      type="monotone"
                      fill="var(--color-monthlyRent)"
                      strokeWidth={2}
                      dot={true}
                    />
                  </BarChart>
                </ChartContainer>
              </Card>
            </div>
          </div>

          {/* <div>
          <Card>
      <CardHeader>
        <CardTitle>Monthly Breakdown</CardTitle>
        <CardDescription>Rent, Costs, and Cash Flow</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{fill: "#444444"}}
            />
            <ChartTooltip
            className="bg-white text-black"
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="value" fill="#444444" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
          </div> */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Long-term Projection</h3>
          </div>
          <Card>
            <div>
              <div className="mt-4  px-4">
                <div className="flex justify-between items-center">
                  <p className="w-1/2">Select Growth Period</p>
                  <Select
                    className=""
                    value={growthPeriod}
                    onValueChange={setGrowthPeriod}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select growth period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="25">25 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Total Rent"
                      stroke="#1e40af"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="Total Costs"
                      stroke="#b91c1c"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="Total Profit"
                      stroke="#15803d"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="">
      <h1 className="text-5xl font-bold text-center py-4">
        Rental Property Calculator
      </h1>
      <div className="flex ">
        <div className="w-1/2 p-4 ">
          <Card className=" mb-4 te">
            <CardHeader>
              <CardTitle>Property</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="propertyPrice">Property Price</Label>
                  <Input
                    id="propertyPrice"
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className=" text-black"
                  />
                </div>
                <div>
                  <Label htmlFor="downPayment">Down Payment (%)</Label>
                  <Slider
                    id="downPayment"
                    min={0}
                    max={100}
                    step={1}
                    value={[downPaymentPercentage]}
                    onValueChange={(value) =>
                      setDownPaymentPercentage(value[0])
                    }
                    className="my-2"
                  />
                  <span>{downPaymentPercentage}%</span>
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Slider
                    id="interestRate"
                    min={2}
                    max={8}
                    step={0.1}
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
                    className="my-2"
                  />
                  <span>{interestRate.toFixed(1)}%</span>
                </div>
                <div>
                  <Label htmlFor="mortgageTerm">Mortgage Term (years)</Label>
                  <Slider
                    id="mortgageTerm"
                    min={0}
                    max={30}
                    step={5}
                    value={[mortgageTerm]}
                    onValueChange={(value) => setMortgageTerm(value[0])}
                    className="my-2"
                  />
                  <span>{mortgageTerm} years</span>
                </div>
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className=""
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle>Additional Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Property Tax */}
                <div>
                  <Label htmlFor="propertyTax">Property Tax</Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      id="propertyTaxPercentage"
                      checked={propertyTaxType === "percentage"}
                      onChange={() => setPropertyTaxType("percentage")}
                    />
                    <label htmlFor="propertyTaxPercentage">%</label>
                    <input
                      type="radio"
                      id="propertyTaxAmount"
                      checked={propertyTaxType === "amount"}
                      onChange={() => setPropertyTaxType("amount")}
                    />
                    <label htmlFor="propertyTaxAmount">$</label>
                  </div>
                  <Input
                    id={
                      propertyTaxType === "percentage"
                        ? "propertyTaxRate"
                        : "propertyTaxAmount"
                    }
                    type="number"
                    value={
                      propertyTaxType === "percentage"
                        ? propertyTaxRate
                        : propertyTaxAmount
                    }
                    onChange={(e) =>
                      propertyTaxType === "percentage"
                        ? setPropertyTaxRate(Number(e.target.value))
                        : setPropertyTaxAmount(Number(e.target.value))
                    }
                    className=""
                  />
                </div>

                {/* Insurance */}
                <div>
                  <Label htmlFor="insurance">Insurance</Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      id="insurancePercentage"
                      checked={insuranceType === "percentage"}
                      onChange={() => setInsuranceType("percentage")}
                    />
                    <label htmlFor="insurancePercentage">%</label>
                    <input
                      type="radio"
                      id="insuranceAmount"
                      checked={insuranceType === "amount"}
                      onChange={() => setInsuranceType("amount")}
                    />
                    <label htmlFor="insuranceAmount">$</label>
                  </div>
                  <Input
                    id={
                      insuranceType === "percentage"
                        ? "insuranceRate"
                        : "insuranceAmount"
                    }
                    type="number"
                    value={
                      insuranceType === "percentage"
                        ? insuranceRate
                        : insuranceAmount
                    }
                    onChange={(e) =>
                      insuranceType === "percentage"
                        ? setInsuranceRate(Number(e.target.value))
                        : setInsuranceAmount(Number(e.target.value))
                    }
                    className=""
                  />
                </div>

                {/* Maintenance */}
                <div>
                  <Label htmlFor="maintenance">Maintenance</Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      id="maintenancePercentage"
                      checked={maintenanceType === "percentage"}
                      onChange={() => setMaintenanceType("percentage")}
                    />
                    <label htmlFor="maintenancePercentage">%</label>
                    <input
                      type="radio"
                      id="maintenanceAmount"
                      checked={maintenanceType === "amount"}
                      onChange={() => setMaintenanceType("amount")}
                    />
                    <label htmlFor="maintenanceAmount">$</label>
                  </div>
                  <Input
                    id={
                      maintenanceType === "percentage"
                        ? "maintenanceRate"
                        : "maintenanceAmount"
                    }
                    type="number"
                    value={
                      maintenanceType === "percentage"
                        ? maintenanceRate
                        : maintenanceAmount
                    }
                    onChange={(e) =>
                      maintenanceType === "percentage"
                        ? setMaintenanceRate(Number(e.target.value))
                        : setMaintenanceAmount(Number(e.target.value))
                    }
                    className=""
                  />
                </div>

                {/* Vacancy */}
                <div>
                  <Label htmlFor="vacancy">Vacancy</Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      id="vacancyPercentage"
                      checked={vacancyType === "percentage"}
                      onChange={() => setVacancyType("percentage")}
                    />
                    <label htmlFor="vacancyPercentage">%</label>
                    <input
                      type="radio"
                      id="vacancyAmount"
                      checked={vacancyType === "amount"}
                      onChange={() => setVacancyType("amount")}
                    />
                    <label htmlFor="vacancyAmount">$</label>
                  </div>
                  <Input
                    id={
                      vacancyType === "percentage"
                        ? "vacancyRate"
                        : "vacancyAmount"
                    }
                    type="number"
                    value={
                      vacancyType === "percentage" ? vacancyRate : vacancyAmount
                    }
                    onChange={(e) =>
                      vacancyType === "percentage"
                        ? setVacancyRate(Number(e.target.value))
                        : setVacancyAmount(Number(e.target.value))
                    }
                    className=""
                  />
                </div>

                {/* Condo Fees */}
                <div>
                  <Label htmlFor="condoFees">Condo Fees</Label>
                  <Input
                    id="condoFees"
                    type="number"
                    value={condoFees}
                    onChange={(e) => setCondoFees(Number(e.target.value))}
                    className=""
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between py-4">
            {/* <button onClick={addProperty} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Property
      </button> */}
            {/* <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        View Properties
      </button> */}
          </div>
        </div>

        <div className="w-1/2 p-4 ">
          <ResultsSection />
        </div>
      </div>
    </div>
  );
};

export default RentalPropertyCalculator;
