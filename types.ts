import React from 'react';

export enum AppState {
  HOME = 'HOME',
  LOADING = 'LOADING',
  EMAIL_GATE = 'EMAIL_GATE',
  WAITLIST = 'WAITLIST',
}

export enum TabMode {
  DESIGN = 'DESIGN',
  STENCIL = 'STENCIL',
  TRY_ON = 'TRY_ON',
  COVER_UP = 'COVER_UP',
}

export interface TabConfig {
  id: TabMode;
  label: string;
  icon: React.ReactNode;
  elementId: string;
  placeholder: string;
}