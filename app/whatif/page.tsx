/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { Badge } from "@/components/ui/badge";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Select = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.Select),
  { ssr: false }
);
const SelectContent = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectContent),
  { ssr: false }
);
const SelectItem = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectItem),
  { ssr: false }
);
const SelectTrigger = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectTrigger),
  { ssr: false }
);
const SelectValue = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectValue),
  { ssr: false }
);

const WhatIfScenario = () => {
  // State for property details (left side)
  const [propertyPrice, setPropertyPrice] = useState(250000);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20);
  const [interestRate, setInterestRate] = useState(5);
  const [mortgageTerm, setMortgageTerm] = useState(30);
  const [monthlyRent, setMonthlyRent] = useState(1800);
  const [downPayment, setDownPayment] = useState(0);
  const [principalPaid, setPrincipalPaid] = useState(0);
  const [assumedAppreciation, setAssumedAppreciation] = useState(0);

  const [netProfit, setNetProfit] = useState(0);
  const [individualNetProfit, setIndividualNetProfit] = useState(0);

  // State for additional costs (left side)
  const [propertyTaxType, setPropertyTaxType] = useState("percentage");
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.5);
  const [propertyTaxAmount, setPropertyTaxAmount] = useState(3750);

  const [insuranceType, setInsuranceType] = useState("percentage");
  const [insuranceRate, setInsuranceRate] = useState(0.4);
  const [insuranceAmount, setInsuranceAmount] = useState(1000);

  const [maintenanceType, setMaintenanceType] = useState("percentage");
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [maintenanceAmount, setMaintenanceAmount] = useState(2500);

  const [vacancyType, setVacancyType] = useState("percentage");
  const [vacancyRate, setVacancyRate] = useState(5);
  const [vacancyAmount, setVacancyAmount] = useState(1080);

  const [condoFees, setCondoFees] = useState(0);

  // State for What If scenario (right side)
  const [investorCount, setInvestorCount] = useState("4");
  const [sellingTimeframe, setSellingTimeframe] = useState("5");
  const [netCashFlow, setNetCashFlow] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  const [totalEquity, setTotalEquity] = useState(0);
  const [individualEquity, setIndividualEquity] = useState(0);

  const [grossProfit, setGrossProfit] = useState(0);
  const [individualGrossProfit, setIndividualGrossProfit] = useState(0);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate net cash flow and total profit
  useEffect(() => {
    // Property details calculations
    const downPayment = propertyPrice * (downPaymentPercentage / 100);
    const loanAmount = propertyPrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = mortgageTerm * 12;
    const monthlyMortgage =
      (loanAmount *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Calculate total amount paid towards the mortgage over the selling timeframe
    const totalPaidOverTime = monthlyMortgage * 12 * parseInt(sellingTimeframe);
    const totalInterestPaid =
      totalPaidOverTime -
      (loanAmount -
        loanAmount *
          Math.pow(
            1 + monthlyInterestRate,
            -(12 * parseInt(sellingTimeframe))
          ));
    const principalPaid = totalPaidOverTime - totalInterestPaid;

    // Calculate monthly expenses
    const monthlyPropertyTax =
      propertyTaxType === "percentage"
        ? (propertyPrice * (propertyTaxRate / 100)) / 12
        : propertyTaxAmount / 12;
    const monthlyInsurance =
      insuranceType === "percentage"
        ? (propertyPrice * (insuranceRate / 100)) / 12
        : insuranceAmount / 12;
    const monthlyMaintenance =
      maintenanceType === "percentage"
        ? (propertyPrice * (maintenanceRate / 100)) / 12
        : maintenanceAmount / 12;
    const monthlyVacancy =
      vacancyType === "percentage"
        ? monthlyRent * (vacancyRate / 100)
        : vacancyAmount / 12;

    const totalMonthlyExpenses =
      monthlyMortgage +
      monthlyPropertyTax +
      monthlyInsurance +
      monthlyMaintenance +
      monthlyVacancy +
      condoFees;
    const monthlyNetCashFlow = monthlyRent - totalMonthlyExpenses;

    const totalProfit = monthlyNetCashFlow * 12 * parseInt(sellingTimeframe);
    setTotalProfit(totalProfit);

    // Calculate total income and expenses over the selling timeframe
    const totalRentalIncome = monthlyRent * 12 * parseInt(sellingTimeframe);
    const totalExpenses =
      totalMonthlyExpenses * 12 * parseInt(sellingTimeframe);

    // Calculate appreciation and selling price
    const assumedAppreciation =
      propertyPrice * (Math.pow(1.03, parseInt(sellingTimeframe)) - 1);
    const sellingPrice = propertyPrice + assumedAppreciation;

    // Calculate capital gains and tax
    const capitalGains = sellingPrice - propertyPrice;

    let taxableCapitalGains;
  if (capitalGains <= 250000) {
    taxableCapitalGains = capitalGains * 0.5; // 50% of capital gains are taxable
  } else {
    // For gains over $250,000, 50% of the first $250,000 and 66.7% of the remainder
    taxableCapitalGains = (250000 * 0.5) + ((capitalGains - 250000) * 0.667);
  }

  // For simplicity, we'll use the highest federal tax bracket rate
  // In a real scenario, you'd need to calculate the exact tax based on total income
  const highestFederalTaxRate = 0.33;
  // Assume a high provincial tax rate (e.g., Ontario's highest rate)
  const highestProvincialTaxRate = 0.20;
  const combinedTaxRate = highestFederalTaxRate + highestProvincialTaxRate;

  const taxOnCapitalGains = taxableCapitalGains * combinedTaxRate;



    const corporateTaxRate = 0.15;

    // Calculate total equity
    const totalEquity = downPayment + principalPaid + assumedAppreciation;
    const individualEquity = totalEquity / parseInt(investorCount);

    // Calculate gross profit (before considering initial investment and expenses)
    const grossProfit = capitalGains - taxOnCapitalGains;
    const individualGrossProfit = grossProfit / parseInt(investorCount);

    // Calculate net profit (considering all income, expenses, and taxes)
    const netProfit =
      totalRentalIncome +
      sellingPrice -
      (propertyPrice + totalExpenses + taxOnCapitalGains);
    const individualNetProfit = netProfit / parseInt(investorCount);

    setNetCashFlow(monthlyNetCashFlow);
    setDownPayment(downPayment);
    setPrincipalPaid(principalPaid);
    setAssumedAppreciation(assumedAppreciation);
    setTotalEquity(totalEquity);
    setIndividualEquity(individualEquity);
    setGrossProfit(grossProfit);
    setIndividualGrossProfit(individualGrossProfit);
    setNetProfit(netProfit);
    setIndividualNetProfit(individualNetProfit);
  }, [
    propertyPrice,
    downPaymentPercentage,
    interestRate,
    mortgageTerm,
    monthlyRent,
    sellingTimeframe,
    investorCount,
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

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
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
                />
              </div>
              <div>
                <Label htmlFor="downPaymentPercentage">Down Payment (%)</Label>
                <Slider
                  id="downPaymentPercentage"
                  min={0}
                  max={100}
                  step={1}
                  value={[downPaymentPercentage]}
                  onValueChange={(value) => setDownPaymentPercentage(value[0])}
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
                />
              </div>
              {/* Add more inputs for interestRate, mortgageTerm, and monthlyRent */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Additional Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Property Tax</Label>
                <RadioGroup
                  defaultValue={propertyTaxType}
                  onValueChange={setPropertyTaxType}
                  className="flex space-x-4 mb-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="percentage"
                      id="propertyTaxPercentage"
                    />
                    <Label htmlFor="propertyTaxPercentage">Percentage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amount" id="propertyTaxAmount" />
                    <Label htmlFor="propertyTaxAmount">Amount</Label>
                  </div>
                </RadioGroup>
                <Input
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
                />
              </div>

              <div>
                <Label>Insurance</Label>
                <RadioGroup
                  defaultValue={insuranceType}
                  onValueChange={setInsuranceType}
                  className="flex space-x-4 mb-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="percentage"
                      id="insurancePercentage"
                    />
                    <Label htmlFor="insurancePercentage">Percentage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amount" id="insuranceAmount" />
                    <Label htmlFor="insuranceAmount">Amount</Label>
                  </div>
                </RadioGroup>
                <Input
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
                />
              </div>

              <div>
                <Label>Maintenance</Label>
                <RadioGroup
                  defaultValue={maintenanceType}
                  onValueChange={setMaintenanceType}
                  className="flex space-x-4 mb-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="percentage"
                      id="maintenancePercentage"
                    />
                    <Label htmlFor="maintenancePercentage">Percentage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amount" id="maintenanceAmount" />
                    <Label htmlFor="maintenanceAmount">Amount</Label>
                  </div>
                </RadioGroup>
                <Input
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
                />
              </div>

              <div>
                <Label>Vacancy</Label>
                <RadioGroup
                  defaultValue={vacancyType}
                  onValueChange={setVacancyType}
                  className="flex space-x-4 mb-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="vacancyPercentage" />
                    <Label htmlFor="vacancyPercentage">Percentage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amount" id="vacancyAmount" />
                    <Label htmlFor="vacancyAmount">Amount</Label>
                  </div>
                </RadioGroup>
                <Input
                  type="number"
                  value={
                    vacancyType === "percentage" ? vacancyRate : vacancyAmount
                  }
                  onChange={(e) =>
                    vacancyType === "percentage"
                      ? setVacancyRate(Number(e.target.value))
                      : setVacancyAmount(Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label htmlFor="condoFees">Condo Fees</Label>
                <Input
                  id="condoFees"
                  type="number"
                  value={condoFees}
                  onChange={(e) => setCondoFees(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full md:w-1/2 what-if-scenario">
        <Card>
          <CardHeader>
            <CardTitle>What If Scenario</CardTitle>
            <p className="text-xs text-gray-600">
              Simplified, not accounting for appreciation, rising/declining
              interest rates, or rising/declining rents & condo fees.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-content">What if you had </span>
                <span className="select-container">
                  <Select
                    value={investorCount}
                    onValueChange={setInvestorCount}
                  >
                    <SelectTrigger
                      className=" bg-gray-300 text-black h-6"
                      id="investorCount"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 investors</SelectItem>
                      <SelectItem value="5">5 investors</SelectItem>
                      <SelectItem value="6">6 investors</SelectItem>
                      <SelectItem value="7">7 investors</SelectItem>
                    </SelectContent>
                  </Select>
                </span>
                <span className="text-content">
                  {" "}
                  that collectively bought 1 property for{" "}
                  <Badge className="bg-blue-600 text-white">
                    ${propertyPrice.toLocaleString()}
                  </Badge>
                  and made a down payment of{" "}
                  <Badge className="bg-green-500 text-white">
                    $
                    {(
                      (propertyPrice * downPaymentPercentage) /
                      100
                    ).toLocaleString()}
                  </Badge>
                  for {mortgageTerm} years mortgage, which had a net cash flow
                  of{" "}
                  <Badge
                    className={`text-white ${
                      netCashFlow > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    ${netCashFlow.toFixed(2)}
                  </Badge>{" "}
                  on each month and then decided to sell that in{" "}
                </span>
                <span className="select-container">
                  <Select
                    value={sellingTimeframe}
                    onValueChange={setSellingTimeframe}
                  >
                    <SelectTrigger
                      className=" bg-gray-300 text-black h-6"
                      id="sellingTimeframe"
                    >
                      <SelectValue placeholder="Select selling timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                    </SelectContent>
                  </Select>
                </span>
              </div>
              <div className="py-2">
                <p>
                  You would have <span className="font-bold">collectively</span>{" "}
                  made a total{" "}
                  <span>{netCashFlow > 0 ? "profit" : "loss"}</span> of{" "}
                  <Badge
                    className={`text-white mx-2 ${
                      totalProfit > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    ${totalProfit.toLocaleString()}
                  </Badge>{" "}
                  from rental income.
                </p>
                <p>
                  You would have <span className="font-bold">individually</span>{" "}
                  made a total{" "}
                  <span>{netCashFlow > 0 ? "profit" : "loss"}</span> of{" "}
                  <Badge
                    className={`text-white mx-2 ${
                      totalProfit > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    ${(totalProfit / parseInt(investorCount)).toLocaleString()}
                  </Badge>
                  from rental income.
                </p>
              </div>
              <div className="py-2">
  <p>The <span className="font-bold">collective</span> equity in the property would be <Badge className="bg-purple-600 text-white">${totalEquity.toLocaleString(undefined, {maximumFractionDigits: 2})}</Badge></p>
  <p>Your <span className="font-bold">individual</span> equity in the property would be <Badge className="bg-purple-600 text-white">${individualEquity.toLocaleString(undefined, {maximumFractionDigits: 2})}</Badge></p>
  <p className="text-sm text-gray-600 mt-2">
    This includes the initial down payment of <Badge className="bg-blue-500 text-white">${downPayment.toLocaleString(undefined, {maximumFractionDigits: 2})}</Badge>, 
    the principal paid of <Badge className="bg-green-500 text-white">${principalPaid.toLocaleString(undefined, {maximumFractionDigits: 2})}</Badge>, 
    and the assumed appreciation of <Badge className="bg-yellow-500 text-white">${assumedAppreciation.toLocaleString(undefined, {maximumFractionDigits: 2})}</Badge>.
  </p>
</div>
<div className="py-2">
  <p>If sold after {sellingTimeframe} years:</p>
  <p>The <span className="font-bold">collective</span> gross profit after tax would be <Badge className="bg-green-600 text-white">${grossProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</Badge></p>
  <p>Your <span className="font-bold">individual</span> gross profit after tax would be <Badge className="bg-green-600 text-white">${individualGrossProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</Badge></p>
  <p className="text-sm text-gray-600 mt-2">
    This gross profit represents the gain from the property's appreciation, after accounting for capital gains tax. 
    It does not include rental income, expenses, or the return of your initial investment.
  </p>
</div>

<div className="py-2">
  <p>If sold after {sellingTimeframe} years:</p>
  <p>The <span className="font-bold">collective</span> net profit would be <Badge className={`text-white ${netProfit > 0 ? 'bg-green-600' : 'bg-red-600'}`}>${netProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</Badge></p>
  <p>Your <span className="font-bold">individual</span> net profit would be <Badge className={`text-white ${individualNetProfit > 0 ? 'bg-green-600' : 'bg-red-600'}`}>${individualNetProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}</Badge></p>
  <p className="text-sm text-gray-600 mt-2">
    This net profit includes all rental income over {sellingTimeframe} years, the proceeds from the sale, 
    and subtracts the initial purchase price, all expenses (mortgage, taxes, insurance, maintenance, vacancy, and condo fees), 
    and capital gains tax.
  </p>
  <p className="text-sm text-gray-600">
    The capital gains tax calculation assumes the highest combined federal and provincial tax rate. 
    It applies a 50% inclusion rate for gains up to $250,000 and 66.7% for gains above $250,000. 
    Actual tax may vary based on total income and specific provincial rates.
  </p>
</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatIfScenario;
