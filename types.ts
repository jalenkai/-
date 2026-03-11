export type RoleType = 
  | 'marketing' 
  | 'customer_service' 
  | 'sales_associate' 
  | 'merchandising' 
  | 'inventory'
  | 'performance_manager'
  | 'marketing_planning'
  | 'production'
  | 'art_design';

export interface PromptInputs {
  role: RoleType;
  task: string;
  productInfo: string;
  targetAudience: string;
  tone: string;
  constraints: string;
}

export interface GeneratedPrompt {
  id: string;
  title: string;
  content: string;
  inputs: PromptInputs;
  createdAt: number;
}

export interface RoleDefinition {
  id: RoleType;
  label: string;
  icon: string;
  description: string;
  suggestedTasks: string[];
  suggestedAudiences: string[]; // New field
  suggestedTones: string[];    // New field
}