import React, { useState, useEffect, useContext } from "react";
import { Breadcrumb, BreadcrumbLink } from "../../components/Breadcrumb";
import { Button } from "../../components/Button";
import { Table, Row } from "../../components/Table";
import { Tab, Tabs } from "../../components/Tabs";
import { AuthContext } from "../../providers/AuthProvider";
import { CollectedPrescriptions } from "./collectedPrescriptions";
import { PendingPrescriptions } from "./pendingPrescriptions";

export const PharmacyPrescriptionManager = () => {
  document.title = "Pharmacy Prescription Manager";

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        <BreadcrumbLink href="/pharmacy/prescriptions">
          Manage prescriptions
        </BreadcrumbLink>
      </Breadcrumb>

      <h1>Pharmacy Prescription Requests</h1>
      <p>
        Here you can manage prescriptions that are pending and ready to be
        processed.
      </p>

      <Tabs>
        <Tab label="Awaiting review">
          <PendingPrescriptions />
        </Tab>
        <Tab label="Collected">
          <CollectedPrescriptions />
        </Tab>
      </Tabs>
    </>
  );
};

export default PharmacyPrescriptionManager;
