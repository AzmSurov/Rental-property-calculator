/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useCallback } from 'react';
import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { House } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend, ChartLegendContent
  } from "@/components/ui/chart"
const LongTermInvestmentPlan = () => {
    const [properties, setProperties] = useState(Array(10).fill().map(() => [
        {
          propertyPrice: 250000,
          downPaymentPercentage: 20,
          interestRate: 5,
          mortgageTerm: 30,
          monthlyRent: 1800,
          propertyTaxType: 'percentage',
          propertyTaxRate: 1.5,
          propertyTaxAmount: 3750,
          insuranceType: 'percentage',
          insuranceRate: 0.4,
          insuranceAmount: 1000,
          maintenanceType: 'percentage',
          maintenanceRate: 1,
          maintenanceAmount: 2500,
          condoFees: 0,
          vacancyType: 'percentage',
          vacancyRate: 5,
          vacancyAmount: 1080,
        }
      ]));

  const calculatePropertyDetails = useCallback((property) => {
    const {
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
      vacancyAmount
    } = property;

    const downPayment = propertyPrice * (downPaymentPercentage / 100);
    const loanAmount = propertyPrice - downPayment;
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = mortgageTerm * 12;

    const monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const propertyTax = propertyTaxType === 'percentage' 
      ? (propertyPrice * (propertyTaxRate / 100)) / 12 
      : propertyTaxAmount / 12;

    const insurance = insuranceType === 'percentage'
      ? (propertyPrice * (insuranceRate / 100)) / 12
      : insuranceAmount / 12;

    const maintenance = maintenanceType === 'percentage'
      ? (propertyPrice * (maintenanceRate / 100)) / 12
      : maintenanceAmount / 12;

    const vacancy = vacancyType === 'percentage'
      ? monthlyRent * (vacancyRate / 100)
      : vacancyAmount / 12;

    const totalCosts = monthlyMortgagePayment + propertyTax + insurance + maintenance + vacancy + condoFees;
    const cashFlow = monthlyRent - totalCosts;

    return {
      ...property,
      monthlyMortgage: monthlyMortgagePayment,
      totalMonthlyCosts: totalCosts,
      netCashFlow: cashFlow
    };
  }, []);

  const handlePropertyChange = useCallback((year, propertyIndex, field, value) => {
    setProperties(prevProperties => {
      const newProperties = [...prevProperties];
      newProperties[year - 1] = [...newProperties[year - 1]];
      newProperties[year - 1][propertyIndex] = { 
        ...newProperties[year - 1][propertyIndex], 
        [field]: field.endsWith('Type') ? value : parseFloat(value)
      };
      return newProperties.map(yearProperties => yearProperties.map(calculatePropertyDetails));
    });
  }, [calculatePropertyDetails]);

  const handlePropertyCountChange = useCallback((year, count) => {
    setProperties(prevProperties => {
      const newProperties = [...prevProperties];
      const currentCount = newProperties[year - 1].length;
      if (count > currentCount) {
        // Add new properties
        newProperties[year - 1] = [
          ...newProperties[year - 1],
          ...Array(count - currentCount).fill().map(() => ({ ...newProperties[year - 1][0] }))
        ];
      } else if (count < currentCount) {
        // Remove properties
        newProperties[year - 1] = newProperties[year - 1].slice(0, count);
      }
      return newProperties;
    });
  }, []);

  const renderYearGrid = () => {
    const years = Array.from({ length: 10 }, (_, i) => i + 1);
    return (
      <div className="grid grid-cols-5 gap-4">
        {years.map((year) => (
          <Card key={year} className="p-4">
            <CardHeader>
              <CardTitle>Year {year}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor={`propertyCount-${year}`}>Number of Properties : <span className='text-sm'>{properties[year - 1].length}</span></Label>
                <Slider
                  id={`propertyCount-${year}`}
                  min={1}
                  max={3}
                  step={1}
                  value={[properties[year - 1].length]}
                  onValueChange={(value) => handlePropertyCountChange(year, value[0])}
                />
                
              </div>
              {properties[year - 1].map((property, index) => (
                <Dialog key={index}>
<DialogTrigger asChild>
        <Button className="flex items-center gap-2 mb-2">
          <House size={16} />
          
        </Button>
      </DialogTrigger>
                <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto bg-white text-black">
                  <DialogHeader>
                    <DialogTitle>Property {index + 1} Details - Year {year}</DialogTitle>
                  </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`propertyPrice-${year}-${index}`}>Property Price</Label>
                        <Input
                          id={`propertyPrice-${year}-${index}`}
                          type="number"
                          value={property.propertyPrice}
                          onChange={(e) => handlePropertyChange(year, index, 'propertyPrice', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`downPayment-${year}-${index}`}>Down Payment (%)</Label>
                        <Slider
                          id={`downPayment-${year}-${index}`}
                          min={0}
                          max={100}
                          step={1}
                          value={[property.downPaymentPercentage]}
                          onValueChange={(value) => handlePropertyChange(year, index, 'downPaymentPercentage', value[0])}
                        />
                        <span>{property.downPaymentPercentage}%</span>
                      </div>
                      <div>
                        <Label htmlFor={`interestRate-${year}-${index}`}>Interest Rate (%)</Label>
                        <Slider
                          id={`interestRate-${year}-${index}`}
                          min={0}
                          max={10}
                          step={0.1}
                          value={[property.interestRate]}
                          onValueChange={(value) => handlePropertyChange(year, index, 'interestRate', value[0])}
                        />
                        <span>{property.interestRate}%</span>
                      </div>
                      <div>
                        <Label htmlFor={`mortgageTerm-${year}-${index}`}>Mortgage Term (years)</Label>
                        <Slider
                          id={`mortgageTerm-${year}-${index}`}
                          min={5}
                          max={30}
                          step={1}
                          value={[property.mortgageTerm]}
                          onValueChange={(value) => handlePropertyChange(year, index, 'mortgageTerm', value[0])}
                        />
                        <span>{property.mortgageTerm} years</span>
                      </div>
                      <div>
                        <Label htmlFor={`monthlyRent-${year}-${index}`}>Monthly Rent</Label>
                        <Input
                          id={`monthlyRent-${year}-${index}`}
                          type="number"
                          value={property.monthlyRent}
                          onChange={(e) => handlePropertyChange(year, index, 'monthlyRent', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`propertyTax-${year}-${index}`}>Property Tax</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`propertyTaxPercentage-${year}-${index}`}
                            checked={property.propertyTaxType === 'percentage'}
                            onChange={() => handlePropertyChange(year, index, 'propertyTaxType', 'percentage')}
                          />
                          <label htmlFor={`propertyTaxPercentage-${year}-${index}`}>%</label>
                          <input
                            type="radio"
                            id={`propertyTaxAmount-${year}-${index}`}
                            checked={property.propertyTaxType === 'amount'}
                            onChange={() => handlePropertyChange(year, index, 'propertyTaxType', 'amount')}
                          />
                          <label htmlFor={`propertyTaxAmount-${year}-${index}`}>$</label>
                        </div>
                        <Input
                          type="number"
                          value={property.propertyTaxType === 'percentage' ? property.propertyTaxRate : property.propertyTaxAmount}
                          onChange={(e) => handlePropertyChange(year, index, property.propertyTaxType === 'percentage' ? 'propertyTaxRate' : 'propertyTaxAmount', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`insurance-${year}-${index}`}>Insurance</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`insurancePercentage-${year}-${index}`}
                            checked={property.insuranceType === 'percentage'}
                            onChange={() => handlePropertyChange(year, index, 'insuranceType', 'percentage')}
                          />
                          <label htmlFor={`insurancePercentage-${year}-${index}`}>%</label>
                          <input
                            type="radio"
                            id={`insuranceAmount-${year}-${index}`}
                            checked={property.insuranceType === 'amount'}
                            onChange={() => handlePropertyChange(year, index, 'insuranceType', 'amount')}
                          />
                          <label htmlFor={`insuranceAmount-${year}-${index}`}>$</label>
                        </div>
                        <Input
                          type="number"
                          value={property.insuranceType === 'percentage' ? property.insuranceRate : property.insuranceAmount}
                          onChange={(e) => handlePropertyChange(year, index, property.insuranceType === 'percentage' ? 'insuranceRate' : 'insuranceAmount', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`maintenance-${year}-${index}`}>Maintenance</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`maintenancePercentage-${year}-${index}`}
                            checked={property.maintenanceType === 'percentage'}
                            onChange={() => handlePropertyChange(year, index, 'maintenanceType', 'percentage')}
                          />
                          <label htmlFor={`maintenancePercentage-${year}-${index}`}>%</label>
                          <input
                            type="radio"
                            id={`maintenanceAmount-${year}-${index}`}
                            checked={property.maintenanceType === 'amount'}
                            onChange={() => handlePropertyChange(year, index, 'maintenanceType', 'amount')}
                          />
                          <label htmlFor={`maintenanceAmount-${year}-${index}`}>$</label>
                        </div>
                        <Input
                          type="number"
                          value={property.maintenanceType === 'percentage' ? property.maintenanceRate : property.maintenanceAmount}
                          onChange={(e) => handlePropertyChange(year, index, property.maintenanceType === 'percentage' ? 'maintenanceRate' : 'maintenanceAmount', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`vacancy-${year}-${index}`}>Vacancy</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`vacancyPercentage-${year}-${index}`}
                            checked={property.vacancyType === 'percentage'}
                            onChange={() => handlePropertyChange(year, index, 'vacancyType', 'percentage')}
                          />
                          <label htmlFor={`vacancyPercentage-${year}-${index}`}>%</label>
                          <input
                            type="radio"
                            id={`vacancyAmount-${year}-${index}`}
                            checked={property.vacancyType === 'amount'}
                            onChange={() => handlePropertyChange(year, index, 'vacancyType', 'amount')}
                          />
                          <label htmlFor={`vacancyAmount-${year}-${index}`}>$</label>
                        </div>
                        <Input
                          type="number"
                          value={property.vacancyType === 'percentage' ? property.vacancyRate : property.vacancyAmount}
                          onChange={(e) => handlePropertyChange(year, index, property.vacancyType === 'percentage' ? 'vacancyRate' : 'vacancyAmount', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`condoFees-${year}-${index}`}>Condo Fees</Label>
                        <Input
                          id={`condoFees-${year}-${index}`}
                          type="number"
                          value={property.condoFees}
                          onChange={(e) => handlePropertyChange(year, index, 'condoFees', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      
                  <div className='flex justify-between'>
                      <div>
                          <p className='font-bold'>Monthly Results</p>
                      <p>Monthly Mortgage: <span className='font-bold'>${property.monthlyMortgage?.toFixed(2)}</span></p>
                      <p>Total Monthly Costs: <span className='font-bold'>${property.totalMonthlyCosts?.toFixed(2)}</span></p>
                      <p>Net Cash Flow: <span className='font-bold'>${property.netCashFlow?.toFixed(2)}</span></p>
                      </div>
                      <div>
                      <p className='font-bold'>Yearly Results</p>
                      <p>Monthly Mortgage: <span className='font-bold'>${(property.monthlyMortgage * 12).toFixed(0)}</span></p>
                      <p>Total Monthly Costs: <span className='font-bold'>${(property.totalMonthlyCosts * 12).toFixed(0)}</span></p>
                      <p>Net Cash Flow: <span className='font-bold'>${(property.netCashFlow * 12).toFixed(0)}</span></p>
                      </div>
  
                  </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const calculateCumulativeProfit = useCallback(() => {
    let cumulativeData = [];
    let totalProfit = 0;
  
    for (let year = 1; year <= 10; year++) {
      let yearlyProfit = 0;
      for (let i = 0; i < year; i++) {
        yearlyProfit += properties[i].reduce((sum, property) => sum + property.netCashFlow * 12, 0);
      }
      totalProfit += yearlyProfit;
      cumulativeData.push({
        year,
        cumulativeProfit: totalProfit,
        yearlyProfit: yearlyProfit,
      });
    }
  
    return cumulativeData;
  }, [properties]);


  const calculateEquityBuildUp = useCallback(() => {
    let equityData = [];
    let totalEquity = 0;
  
    for (let year = 1; year <= 10; year++) {
      let yearlyEquity = 0;
      for (let i = 0; i < year; i++) {
        yearlyEquity += properties[i].reduce((sum, prop) => {
          const downPayment = prop.propertyPrice * (prop.downPaymentPercentage / 100);
          const loanAmount = prop.propertyPrice - downPayment;
          const monthlyInterestRate = (prop.interestRate / 100) / 12;
          const numberOfPayments = prop.mortgageTerm * 12;
          
          // Calculate monthly mortgage payment
          const monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
          
          // Calculate total payments made so far
          const totalPaymentsMade = monthlyMortgagePayment * 12 * (year - i);
          
          // Calculate remaining loan balance
          const remainingBalance = loanAmount * (Math.pow(1 + monthlyInterestRate, numberOfPayments) - Math.pow(1 + monthlyInterestRate, totalPaymentsMade / monthlyMortgagePayment)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
          
          // Assume 3% annual appreciation (you can adjust this or make it a property-specific value)
          const appreciatedValue = prop.propertyPrice * Math.pow(1.03, year - i);
          
          // Calculate equity for this property
          const propertyEquity = appreciatedValue - remainingBalance;
          return sum + propertyEquity;
        }, 0);
      }
      totalEquity += yearlyEquity;
      equityData.push({
        year,
        totalEquity: totalEquity,
        yearlyEquity: yearlyEquity,
      });
    }
  
    return equityData;
  }, [properties]);

  const calculateCashOnCash = useCallback(() => {
    let cashOnCashData = [];
  
    for (let year = 1; year <= 10; year++) {
      let totalCashFlow = 0;
      let totalInvestment = 0;
  
      for (let i = 0; i < year; i++) {
        properties[i].forEach(property => {
          // Calculate annual cash flow
          totalCashFlow += property.netCashFlow * 12;
  
          // Calculate total investment (assuming down payment is the investment)
          totalInvestment += property.propertyPrice * (property.downPaymentPercentage / 100);
        });
      }
  
      // Calculate Cash on Cash return
      const cashOnCash = totalInvestment > 0 ? (totalCashFlow / totalInvestment) * 100 : 0;
  
      cashOnCashData.push({
        year,
        cashOnCash: cashOnCash
      });
    }
  
    return cashOnCashData;
  }, [properties]);

  const calculateBreakeven = useCallback(() => {
    let breakevenData = [];
  
    properties.forEach((yearProperties, yearIndex) => {
      yearProperties.forEach((property, propertyIndex) => {
        const initialInvestment = property.propertyPrice * (property.downPaymentPercentage / 100);
        let cumulativeCashFlow = 0;
        let breakevenYear = 0;
  
        while (cumulativeCashFlow < initialInvestment) {
          breakevenYear++;
          cumulativeCashFlow += property.netCashFlow * 12;
        }
  
        breakevenData.push({
          year: yearIndex + 1,
          property: propertyIndex + 1,
          breakevenYear: breakevenYear,
          initialInvestment,
        });
      });
    });
  
    return breakevenData;
  }, [properties]);

  const chartCumulativeProfitConfig = {
    cumulativeProfit: {
      label: "Cumulative Profit",
      color: "hsl(var(--chart-1))"
    },
    yearlyProfit: {
      label: "Yearly Profit",
      color: "hsl(var(--chart-2))"
    },
  }

  const chartEquityBuildUpConfig = {
    totalEquity: {
      label: "Total Equity",
      color: "hsl(var(--chart-1))"
    },
    yearlyEquity: {
      label: "Yearly Equity",
      color: "hsl(var(--chart-2))"
    },
  }

//   const chartCashOnCashConfig = {
//     cashOnCash: {
//       label: "Cash on Cash",
//       color: "hsl(var(--chart-1))"
//     },
//   }

  return (
    <div className='container mx-auto'>
      <h1 className="text-2xl font-bold mb-4">Long Term Investment Plan</h1>
      {renderYearGrid()}

      <div className="mt-8 bg-white p-4 rounded-lg">
      <Tabs defaultValue="cumulative-profit" className="w-full ">
        <TabsList className="grid w-full grid-cols-4 bg-white gap-10">
          <TabsTrigger className=" text-black" value="cumulative-profit">Cumulative Profit</TabsTrigger>
          <TabsTrigger className=" text-black" value="equity-build-up">Equity Build Up</TabsTrigger>
          <TabsTrigger className=" text-black" value="cash-on-cash">Cash On Cash</TabsTrigger>
          <TabsTrigger className=" text-black" value="breakeven-analysis">Breakeven analysis</TabsTrigger>

          {/* Add more TabsTriggers here for future tabs */}
        </TabsList>
        <TabsContent value="cumulative-profit">
          <Card>
            <CardHeader>
              <CardTitle>Profit Over 10 Years</CardTitle>
              <CardDescription>Year 1 - Year 10</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartCumulativeProfitConfig} >
                <LineChart
                  accessibilityLayer
                  data={calculateCumulativeProfit()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={true}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={true}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    tickCount={10}
                  />
                  <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    dataKey="cumulativeProfit"
                    type="monotone"
                    stroke="var(--color-cumulativeProfit)"
                    strokeWidth={2}
                    dot={true}
                  />
                  <Line
                    dataKey="yearlyProfit"
                    type="monotone"
                    stroke="var(--color-yearlyProfit)"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>


              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up over 10 years <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Showing cumulative and yearly profit for 10 years
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="equity-build-up">
          <Card>
            <CardHeader>
              <CardTitle>Equity Build Up Over 10 Years : <span> Assume 3% annual appreciation</span></CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartEquityBuildUpConfig} >
                <BarChart
                  accessibilityLayer
                  data={calculateEquityBuildUp()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={true}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={true}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    tickCount={10}
                  />
                  <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="totalEquity"
                    type="monotone"
                    fill="var(--color-totalEquity)"
                    strokeWidth={2}
                    dot={true}
                  />
                  <Bar
                    dataKey="yearlyEquity"
                    type="monotone"
                    fill="var(--color-yearlyEquity)"
                    strokeWidth={2}
                    dot={true}
                  />
                </BarChart>


              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up over 10 years <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Showing total equity and yearly equity for 10 years
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
  <TabsContent value="cash-on-cash">
  <Card>
    <CardHeader>
      <CardTitle>Cash on Cash Return Over 10 Years </CardTitle>
      <p><span className='text-sm text-gray-600'>Annual cash flow divided by the initial investment</span></p>
      <div className='pb-4'>
    <Dialog>
  <DialogTrigger className='text-sm bg-gray-500 text-white rounded-md px-2 py-1'>Learn more</DialogTrigger>
  <DialogContent className='max-w-[800px] max-h-[80vh] overflow-y-auto bg-white text-black'>
    <DialogHeader>
      <DialogTitle>What does cash on cash mean?</DialogTitle>
      <DialogDescription>
      Cash-on-cash return (CoC return) is a metric that measures the annual cash flow generated by an investment as a percentage of the initial cash investment. It provides a snapshot of how much income an investor is receiving relative to the amount of money they have invested.

In practice, it shows how efficiently an investment is generating income on the actual cash that was used. It doesn't account for things like appreciation, taxes, or loan payments—just the direct cash flow versus the cash initially invested.

For example, if you invest $50,000 and the investment generates $5,000 in annual cash flow, the cash-on-cash return would be:
<br/>
<br/>
 <span className='font-bold text-center'>$ 5000 / $ 50000 = 10%</span>
 <br/>
 <br/>
This means you're earning 10% of your initial cash investment back annually.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
    </CardHeader>
    <CardContent>
    
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={calculateCashOnCash()}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis unit="%" />
            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cashOnCash" 
              stroke="#82ca9d" 
              name="Cash on Cash Return"
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</TabsContent>
<TabsContent value="breakeven-analysis">
  <Card>
    <CardHeader>
      <CardTitle>Breakeven Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Year Acquired</th>
              <th className="text-left">Property</th>
              <th className="text-left">Initial Investment</th>
              <th className="text-left">Breakeven Year</th>
              <th className="text-left">Years to Breakeven</th>
            </tr>
          </thead>
          <tbody>
            {calculateBreakeven().map((item, index) => (
              <tr key={index}>
                <td>{item.year}</td>
                <td>{item.property}</td>
                <td>${item.initialInvestment.toFixed(2)}</td>
                <td>{item.year + item.breakevenYear - 1}</td>
                <td>{item.breakevenYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</TabsContent>
        {/* Add more TabsContent here for future tabs */}
      </Tabs>
    </div>
  </div>
  );
};

export default LongTermInvestmentPlan;