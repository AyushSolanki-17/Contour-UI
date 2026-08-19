# Project Scope

**Status:** controlling frontend repository scope
**Updated:** 2026-08-19

## Purpose

This repository owns Contour's browser experience. The first complete user path
will let a user open or create a workspace, add a supported source, observe its
processing, search admitted knowledge, open an entity, and inspect exact source
evidence and the producing run.

## Repository ownership

This repository owns:

- browser routes, layouts, components, interaction, and visual design;
- accessibility, responsive behavior, frontend performance, and browser
  security;
- frontend state, navigation, forms, loading/error/retry behavior, and API
  adapters;
- generated or pinned frontend representations of published HTTP contracts;
- component, integration, and browser tests; and
- implementation-coupled frontend documentation and deployment configuration.

This repository does not own backend domain rules, authorization enforcement,
persistence, workers, ingestion correctness, API schemas, or private product and
research material.

## Phase 0 scope

- an accessible responsive application shell;
- honest navigation for the initial Contour surfaces;
- workspace and source setup when their contracts exist;
- ingestion status, failure, retry, and cancellation behavior when published;
- search, entity, relationship, evidence, source-version, and run inspection
  when published; and
- a bounded sample journey verified in the browser.

The shell may identify later surfaces as unavailable. It must not simulate
their availability or invent backend behavior.

## Non-goals

- backend business logic or direct database access;
- frontend-only authorization or data-integrity enforcement;
- a general chat interface;
- agent, graph, governance, or evaluation-dashboard behavior before its roadmap
  phase and contract;
- a large design system or state framework before real use requires it; and
- hand-maintained copies of backend wire types spread through components.
