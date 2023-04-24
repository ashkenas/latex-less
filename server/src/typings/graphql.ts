import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  removeProjectEquation: Project;
  removeProjectResponse: Project;
  removeUserEquation: NamedText;
  updateEquation: NamedText;
  updateProject: Project;
};


export type MutationRemoveProjectEquationArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveProjectResponseArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveUserEquationArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateEquationArgs = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateProjectArgs = {
  equations?: InputMaybe<Array<InputMaybe<NamedTextInput>>>;
  id: Scalars['ID'];
  responses?: InputMaybe<Array<InputMaybe<NamedTextInput>>>;
};

export type NamedText = {
  __typename?: 'NamedText';
  _id: Scalars['ID'];
  name: Scalars['String'];
  text: Scalars['String'];
};

export type NamedTextInput = {
  _id: Scalars['ID'];
  name: Scalars['String'];
  text: Scalars['String'];
};

export type Project = {
  __typename?: 'Project';
  _id: Scalars['ID'];
  equations: Array<Maybe<NamedText>>;
  lastEdited: Scalars['Int'];
  name: Scalars['String'];
  responses: Array<Maybe<NamedText>>;
};

export type Query = {
  __typename?: 'Query';
  equation?: Maybe<NamedText>;
  project?: Maybe<Project>;
  response?: Maybe<NamedText>;
  userEquations: Array<Maybe<NamedText>>;
  userProjects: Array<Maybe<Project>>;
};


export type QueryEquationArgs = {
  id: Scalars['ID'];
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
};


export type QueryResponseArgs = {
  id: Scalars['ID'];
};


export type QueryUserEquationsArgs = {
  id: Scalars['ID'];
};


export type QueryUserProjectsArgs = {
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  equations: Array<Maybe<NamedText>>;
  firebaseId: Scalars['String'];
  projects: Array<Maybe<Project>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  NamedText: ResolverTypeWrapper<NamedText>;
  NamedTextInput: NamedTextInput;
  Project: ResolverTypeWrapper<Project>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  NamedText: NamedText;
  NamedTextInput: NamedTextInput;
  Project: Project;
  Query: {};
  String: Scalars['String'];
  User: User;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  removeProjectEquation?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationRemoveProjectEquationArgs, 'id'>>;
  removeProjectResponse?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationRemoveProjectResponseArgs, 'id'>>;
  removeUserEquation?: Resolver<ResolversTypes['NamedText'], ParentType, ContextType, RequireFields<MutationRemoveUserEquationArgs, 'id'>>;
  updateEquation?: Resolver<ResolversTypes['NamedText'], ParentType, ContextType, RequireFields<MutationUpdateEquationArgs, 'id'>>;
  updateProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'id'>>;
};

export type NamedTextResolvers<ContextType = any, ParentType extends ResolversParentTypes['NamedText'] = ResolversParentTypes['NamedText']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  equations?: Resolver<Array<Maybe<ResolversTypes['NamedText']>>, ParentType, ContextType>;
  lastEdited?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  responses?: Resolver<Array<Maybe<ResolversTypes['NamedText']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  equation?: Resolver<Maybe<ResolversTypes['NamedText']>, ParentType, ContextType, RequireFields<QueryEquationArgs, 'id'>>;
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectArgs, 'id'>>;
  response?: Resolver<Maybe<ResolversTypes['NamedText']>, ParentType, ContextType, RequireFields<QueryResponseArgs, 'id'>>;
  userEquations?: Resolver<Array<Maybe<ResolversTypes['NamedText']>>, ParentType, ContextType, RequireFields<QueryUserEquationsArgs, 'id'>>;
  userProjects?: Resolver<Array<Maybe<ResolversTypes['Project']>>, ParentType, ContextType, RequireFields<QueryUserProjectsArgs, 'id'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  equations?: Resolver<Array<Maybe<ResolversTypes['NamedText']>>, ParentType, ContextType>;
  firebaseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projects?: Resolver<Array<Maybe<ResolversTypes['Project']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  NamedText?: NamedTextResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

