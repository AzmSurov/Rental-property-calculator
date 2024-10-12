/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const EquityLoanExplanation: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Understanding Equity Loans for Property Investment</h1>
      
      <p className="mb-4">Let's break down the process of using equity loans for property investment step by step with an example:</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Step 1: Buy the First Property</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Purchase Price of Property 1: $400,000</li>
        <li>Down Payment (20%): $80,000</li>
        <li>Loan (Mortgage): $320,000</li>
      </ul>
      <p>You now own a property with a loan balance of $320,000, and your equity (what you own outright) is $80,000.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Step 2: Property Value Increases Over Time</h2>
      <p>After 2 years, let's assume the property's value has increased due to market appreciation:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>New Value of Property 1: $450,000 (an increase of $50,000)</li>
        <li>Remaining Loan Balance: $310,000 (assuming $10,000 paid off)</li>
        <li>New Equity: $450,000 - $310,000 = $140,000</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Step 3: Borrow Against the Equity</h2>
      <p>Many landlords will refinance or take a home equity loan against their increased equity:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Maximum Borrowing Limit: 80% of $450,000 = $360,000</li>
        <li>Remaining Loan Balance: $310,000</li>
        <li>Available Equity to Borrow: $360,000 - $310,000 = $50,000</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Step 4: Buy the Second Property</h2>
      <p>Use the borrowed equity as a down payment for the second property:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Purchase Price of Property 2: $400,000</li>
        <li>Down Payment (20%): $80,000 ($50,000 from equity loan + $30,000 from savings)</li>
        <li>New Loan for Property 2: $320,000</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Step 5: Repeat the Process</h2>
      <p>As properties appreciate and you build more equity, you can repeat this process to acquire more properties.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Key Assumptions</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Property values increase over time, providing additional equity.</li>
        <li>You can access equity via refinancing or a home equity loan.</li>
        <li>Rental income helps cover mortgage payments, keeping properties cash-flow neutral or positive.</li>
      </ul>
    </div>
  );
};

export default EquityLoanExplanation;