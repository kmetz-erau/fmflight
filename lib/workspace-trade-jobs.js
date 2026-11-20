// Fictional, trade-specific AI training scenarios. Never use as actual work instructions.
export const TRADE_JOBS={
  "hvac": [
    {
      "id": "history",
      "title": "Investigate recurring cooling complaints",
      "type": "Maintenance history",
      "task": "Use AI to identify recurring patterns in the maintenance history, separate reports from verified facts, and prepare questions for a qualified technician.",
      "output": "Source-grounded recurring-issue briefing",
      "location": "Science Building · Room 214",
      "asset": "RTU-3",
      "docs": [
        {
          "name": "WO history · Sep",
          "body": "09/03: Occupant reports afternoon room temperature of 78°F against a 72°F setpoint; no field measurement recorded."
        },
        {
          "name": "WO history · follow-up",
          "body": "09/19: BAS shows 100% damper command; actual position and airflow were not verified."
        },
        {
          "name": "WO history · Oct",
          "body": "10/11: Similar complaint logged; BAS trend screenshot lacks timestamp."
        },
        {
          "name": "WO history · Nov",
          "body": "11/07: Asset register lists RTU-3A, while the work order identifies RTU-3."
        }
      ]
    },
    {
      "id": "records",
      "title": "Compare BAS and asset records",
      "type": "Document comparison",
      "task": "Compare the work order with conflicting records. Cite each source, list discrepancies, and identify who should verify them.",
      "output": "Discrepancy table with source labels and next checks",
      "location": "Science Building · Room 214",
      "asset": "RTU-3",
      "docs": [
        {
          "name": "Current work order",
          "body": "WO-26411 lists RTU-3 serving Science Building Room 214."
        },
        {
          "name": "Reference record",
          "body": "Asset register lists RTU-3A serving Room 214 Annex; last location check is blank."
        },
        {
          "name": "Supporting source",
          "body": "BAS export lists point RTU3-DMP-CMD but no physical-position feedback."
        }
      ]
    },
    {
      "id": "vendor",
      "title": "Clarify an actuator recommendation",
      "type": "Vendor communication",
      "task": "Use AI to draft questions for a supplier or vendor without inventing part numbers, diagnoses, dimensions, or approvals.",
      "output": "Professional vendor clarification email",
      "location": "Science Building · Room 214",
      "asset": "RTU-3",
      "docs": [
        {
          "name": "Vendor correspondence",
          "body": "Vendor suggests replacing a damper actuator but has not confirmed the installed model."
        },
        {
          "name": "Equipment identification",
          "body": "Equipment photo does not show a readable RTU or actuator nameplate."
        },
        {
          "name": "Purchasing status",
          "body": "Purchasing has no verified OEM replacement part number or authorization."
        }
      ]
    },
    {
      "id": "handoff",
      "title": "Prepare an HVAC shift handoff",
      "type": "Shift communication",
      "task": "Turn the shift notes into a useful handoff separating reported facts, unknowns, verification steps, and qualified human ownership.",
      "output": "Concise crew-ready handoff",
      "location": "Science Building · Room 214",
      "asset": "RTU-3",
      "docs": [
        {
          "name": "Dispatch report",
          "body": "Room 214 remains warm according to occupant; field temperature not yet confirmed."
        },
        {
          "name": "Shift note",
          "body": "BAS command is recorded, but actual airflow and damper position are unknown."
        },
        {
          "name": "Supervisor guidance",
          "body": "Next shift must verify asset identity and review approved HVAC procedures."
        }
      ]
    }
  ],
  "electrical": [
    {
      "id": "history",
      "title": "Review repeated lighting outages",
      "type": "Maintenance history",
      "task": "Use AI to identify recurring patterns in the maintenance history, separate reports from verified facts, and prepare questions for a qualified technician.",
      "output": "Source-grounded recurring-issue briefing",
      "location": "West Wing · Room 118",
      "asset": "Panel W-1",
      "docs": [
        {
          "name": "WO history · Sep",
          "body": "09/05: Lighting outage reported after portable heater use; no cause established."
        },
        {
          "name": "WO history · follow-up",
          "body": "09/22: Second outage complaint; circuit identification was not verified."
        },
        {
          "name": "WO history · Oct",
          "body": "10/15: Damp ceiling tile reported near lighting area; no qualified assessment recorded."
        },
        {
          "name": "WO history · Nov",
          "body": "11/08: Dispatch reports another outage; no repair or reset authorization documented."
        }
      ]
    },
    {
      "id": "records",
      "title": "Reconcile conflicting panel schedules",
      "type": "Document comparison",
      "task": "Compare the work order with conflicting records. Cite each source, list discrepancies, and identify who should verify them.",
      "output": "Discrepancy table with source labels and next checks",
      "location": "West Wing · Room 118",
      "asset": "Panel W-1",
      "docs": [
        {
          "name": "Current work order",
          "body": "WO-26412 identifies Panel W-1 at West Wing Room 118."
        },
        {
          "name": "Reference record",
          "body": "Panel schedule Rev B labels W-1 as Room 118 Annex and lists differing circuit numbers."
        },
        {
          "name": "Supporting source",
          "body": "Asset register identifies W-1A at Room 118; location verification is blank."
        }
      ]
    },
    {
      "id": "vendor",
      "title": "Prepare breaker supplier questions",
      "type": "Vendor communication",
      "task": "Use AI to draft questions for a supplier or vendor without inventing part numbers, diagnoses, dimensions, or approvals.",
      "output": "Professional vendor clarification email",
      "location": "West Wing · Room 118",
      "asset": "Panel W-1",
      "docs": [
        {
          "name": "Vendor correspondence",
          "body": "Supplier proposes a replacement breaker but has no confirmed panel model or circuit identification."
        },
        {
          "name": "Equipment identification",
          "body": "Panel photo does not show a readable manufacturer label or rating."
        },
        {
          "name": "Purchasing status",
          "body": "No qualified diagnosis, approved specification, or purchasing authorization is recorded."
        }
      ]
    },
    {
      "id": "handoff",
      "title": "Prepare an electrical shift handoff",
      "type": "Shift communication",
      "task": "Turn the shift notes into a useful handoff separating reported facts, unknowns, verification steps, and qualified human ownership.",
      "output": "Concise crew-ready handoff",
      "location": "West Wing · Room 118",
      "asset": "Panel W-1",
      "docs": [
        {
          "name": "Dispatch report",
          "body": "Room 118 lighting outage reported; the cause is not established."
        },
        {
          "name": "Shift note",
          "body": "Panel schedule and dispatch circuit descriptions conflict."
        },
        {
          "name": "Supervisor guidance",
          "body": "Damp ceiling tile report remains unverified; qualified staff must follow approved electrical procedures."
        }
      ]
    }
  ],
  "plumbing": [
    {
      "id": "history",
      "title": "Analyze recurring water intrusion",
      "type": "Maintenance history",
      "task": "Use AI to identify recurring patterns in the maintenance history, separate reports from verified facts, and prepare questions for a qualified technician.",
      "output": "Source-grounded recurring-issue briefing",
      "location": "Service Building · Loading Dock 2",
      "asset": "Pump P-2",
      "docs": [
        {
          "name": "WO history · Sep",
          "body": "09/06: Water pooling reported near Loading Dock 2; source not identified."
        },
        {
          "name": "WO history · follow-up",
          "body": "09/24: Another wet-floor complaint after delivery hours; no leak test documented."
        },
        {
          "name": "WO history · Oct",
          "body": "10/16: Pump P-2 mentioned in a shift note, but no inspection results attached."
        },
        {
          "name": "WO history · Nov",
          "body": "11/09: Water reported near a receptacle; area condition and source unconfirmed."
        }
      ]
    },
    {
      "id": "records",
      "title": "Compare pump and valve records",
      "type": "Document comparison",
      "task": "Compare the work order with conflicting records. Cite each source, list discrepancies, and identify who should verify them.",
      "output": "Discrepancy table with source labels and next checks",
      "location": "Service Building · Loading Dock 2",
      "asset": "Pump P-2",
      "docs": [
        {
          "name": "Current work order",
          "body": "WO-26413 lists Pump P-2 at Loading Dock 2."
        },
        {
          "name": "Reference record",
          "body": "Pump register lists P-2B in the adjacent mechanical alcove; equipment identity unverified."
        },
        {
          "name": "Supporting source",
          "body": "Valve diagram uses an older dock naming convention and is not field-verified."
        }
      ]
    },
    {
      "id": "vendor",
      "title": "Clarify a pump parts request",
      "type": "Vendor communication",
      "task": "Use AI to draft questions for a supplier or vendor without inventing part numbers, diagnoses, dimensions, or approvals.",
      "output": "Professional vendor clarification email",
      "location": "Service Building · Loading Dock 2",
      "asset": "Pump P-2",
      "docs": [
        {
          "name": "Vendor correspondence",
          "body": "Supplier suggests a pump seal kit without a confirmed pump model or serial number."
        },
        {
          "name": "Equipment identification",
          "body": "Equipment photo does not show a readable nameplate."
        },
        {
          "name": "Purchasing status",
          "body": "No verified leak source or authorized replacement scope is recorded."
        }
      ]
    },
    {
      "id": "handoff",
      "title": "Prepare a plumbing shift handoff",
      "type": "Shift communication",
      "task": "Turn the shift notes into a useful handoff separating reported facts, unknowns, verification steps, and qualified human ownership.",
      "output": "Concise crew-ready handoff",
      "location": "Service Building · Loading Dock 2",
      "asset": "Pump P-2",
      "docs": [
        {
          "name": "Dispatch report",
          "body": "Water pooling near Loading Dock 2 reported; actual source unknown."
        },
        {
          "name": "Shift note",
          "body": "No valve position, pump condition, or field inspection has been confirmed."
        },
        {
          "name": "Supervisor guidance",
          "body": "Next shift must follow site safety and escalation procedures; qualified staff own decisions."
        }
      ]
    }
  ],
  "carpentry": [
    {
      "id": "history",
      "title": "Review recurring door-latching reports",
      "type": "Maintenance history",
      "task": "Use AI to identify recurring patterns in the maintenance history, separate reports from verified facts, and prepare questions for a qualified technician.",
      "output": "Source-grounded recurring-issue briefing",
      "location": "Student Services · Room 104",
      "asset": "Door D-104",
      "docs": [
        {
          "name": "WO history · Sep",
          "body": "09/04: Door D-104 reportedly does not latch reliably."
        },
        {
          "name": "WO history · follow-up",
          "body": "09/21: Occupant reports the same issue; no closer adjustment documented."
        },
        {
          "name": "WO history · Oct",
          "body": "10/12: Photo of hinge side is incomplete; no hardware identification confirmed."
        },
        {
          "name": "WO history · Nov",
          "body": "11/06: Dispatch notes another latching complaint; egress requirements need qualified review."
        }
      ]
    },
    {
      "id": "records",
      "title": "Reconcile door and hardware schedules",
      "type": "Document comparison",
      "task": "Compare the work order with conflicting records. Cite each source, list discrepancies, and identify who should verify them.",
      "output": "Discrepancy table with source labels and next checks",
      "location": "Student Services · Room 104",
      "asset": "Door D-104",
      "docs": [
        {
          "name": "Current work order",
          "body": "WO-26414 identifies Door D-104 at Student Services Room 104."
        },
        {
          "name": "Reference record",
          "body": "Door schedule lists D-104A at Room 104 Annex; label discrepancy unresolved."
        },
        {
          "name": "Supporting source",
          "body": "Hardware inventory lists two possible closer types; installed model not confirmed."
        }
      ]
    },
    {
      "id": "vendor",
      "title": "Clarify a door closer quote",
      "type": "Vendor communication",
      "task": "Use AI to draft questions for a supplier or vendor without inventing part numbers, diagnoses, dimensions, or approvals.",
      "output": "Professional vendor clarification email",
      "location": "Student Services · Room 104",
      "asset": "Door D-104",
      "docs": [
        {
          "name": "Vendor correspondence",
          "body": "Vendor recommends a closer assembly without verified model or dimensions."
        },
        {
          "name": "Equipment identification",
          "body": "Photo does not show a readable closer manufacturer label."
        },
        {
          "name": "Purchasing status",
          "body": "No approved hardware specification or repair authorization is attached."
        }
      ]
    },
    {
      "id": "handoff",
      "title": "Prepare a maintenance shift handoff",
      "type": "Shift communication",
      "task": "Turn the shift notes into a useful handoff separating reported facts, unknowns, verification steps, and qualified human ownership.",
      "output": "Concise crew-ready handoff",
      "location": "Student Services · Room 104",
      "asset": "Door D-104",
      "docs": [
        {
          "name": "Dispatch report",
          "body": "Room 104 door-latching complaint remains open."
        },
        {
          "name": "Shift note",
          "body": "Installed closer model, dimensions, and cause have not been verified."
        },
        {
          "name": "Supervisor guidance",
          "body": "Qualified staff must review approved access and egress requirements before work."
        }
      ]
    }
  ],
  "grounds": [
    {
      "id": "history",
      "title": "Analyze recurring walkway complaints",
      "type": "Maintenance history",
      "task": "Use AI to identify recurring patterns in the maintenance history, separate reports from verified facts, and prepare questions for a qualified technician.",
      "output": "Source-grounded recurring-issue briefing",
      "location": "North Parking Lot · Walkway C",
      "asset": "Walkway C / Tree N-17",
      "docs": [
        {
          "name": "WO history · Sep",
          "body": "09/07: Ponding reported on Walkway C after rainfall; extent not measured."
        },
        {
          "name": "WO history · follow-up",
          "body": "09/25: Drainage complaint repeated; no verified grade or inlet inspection documented."
        },
        {
          "name": "WO history · Oct",
          "body": "10/18: Low branch reported near the route; tree identification not confirmed."
        },
        {
          "name": "WO history · Nov",
          "body": "11/10: Another walkway complaint after a storm; safe access status not established."
        }
      ]
    },
    {
      "id": "records",
      "title": "Compare grounds maps and inventories",
      "type": "Document comparison",
      "task": "Compare the work order with conflicting records. Cite each source, list discrepancies, and identify who should verify them.",
      "output": "Discrepancy table with source labels and next checks",
      "location": "North Parking Lot · Walkway C",
      "asset": "Walkway C / Tree N-17",
      "docs": [
        {
          "name": "Current work order",
          "body": "WO-26415 identifies Walkway C along the North Parking Lot."
        },
        {
          "name": "Reference record",
          "body": "Site map Rev C labels the segment as Walkway C-East; boundaries differ."
        },
        {
          "name": "Supporting source",
          "body": "Tree inventory lists N-17 near the route, but location has not been field-confirmed."
        }
      ]
    },
    {
      "id": "vendor",
      "title": "Clarify a drainage contractor quote",
      "type": "Vendor communication",
      "task": "Use AI to draft questions for a supplier or vendor without inventing part numbers, diagnoses, dimensions, or approvals.",
      "output": "Professional vendor clarification email",
      "location": "North Parking Lot · Walkway C",
      "asset": "Walkway C / Tree N-17",
      "docs": [
        {
          "name": "Vendor correspondence",
          "body": "Contractor recommends drainage materials without verified measurements or approved scope."
        },
        {
          "name": "Equipment identification",
          "body": "Site photos do not establish dimensions, exact tree identity, or condition."
        },
        {
          "name": "Purchasing status",
          "body": "No approved traffic-control, access, or purchasing authorization is attached."
        }
      ]
    },
    {
      "id": "handoff",
      "title": "Prepare a grounds shift handoff",
      "type": "Shift communication",
      "task": "Turn the shift notes into a useful handoff separating reported facts, unknowns, verification steps, and qualified human ownership.",
      "output": "Concise crew-ready handoff",
      "location": "North Parking Lot · Walkway C",
      "asset": "Walkway C / Tree N-17",
      "docs": [
        {
          "name": "Dispatch report",
          "body": "Walkway C ponding and low-branch reports remain open."
        },
        {
          "name": "Shift note",
          "body": "Extent, exact tree identity, and safe access conditions are not confirmed."
        },
        {
          "name": "Supervisor guidance",
          "body": "Qualified staff must follow approved site and traffic-control procedures."
        }
      ]
    }
  ]
};
