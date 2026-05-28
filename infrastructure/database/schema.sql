-- Enable uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    stripe_customer_id VARCHAR(255) UNIQUE,
    subscription_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'member')),
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: api_keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    monthly_budget INTEGER NOT NULL,
    rate_limit INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_used_at TIMESTAMPTZ
);

-- Table: request_logs (partitioned by month on timestamp)
CREATE TABLE request_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id),
    request_id UUID NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT,
    model VARCHAR(255) NOT NULL,
    tokens INTEGER NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    latency INTEGER NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (timestamp);

-- Create partitions for request_logs for May 2026 and June 2026
CREATE TABLE request_logs_2026_05 PARTITION OF request_logs
    FOR VALUES FROM ('2026-05-01 00:00:00+00') TO ('2026-06-01 00:00:00+00');

CREATE TABLE request_logs_2026_06 PARTITION OF request_logs
    FOR VALUES FROM ('2026-06-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');

-- Table: violations
CREATE TABLE violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id),
    request_id UUID NOT NULL REFERENCES request_logs(id),
    policy_name VARCHAR(255) NOT NULL,
    blocked_text TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- Table: invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    stripe_invoice_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
-- api_keys.key_hash is already indexed by the unique constraint
CREATE INDEX IF NOT EXISTS idx_request_logs_api_key_id ON request_logs (api_key_id);
CREATE INDEX IF NOT EXISTS idx_request_logs_timestamp ON request_logs (timestamp);
-- Index for request_logs.company_id (via api_key_id join) is covered by idx_request_logs_api_key_id
CREATE INDEX IF NOT EXISTS idx_violations_api_key_id ON violations (api_key_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices (company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (status);
-- Additional indexes for dashboard query performance
CREATE INDEX IF NOT EXISTS idx_request_logs_model ON request_logs (model);
CREATE INDEX IF NOT EXISTS idx_request_logs_tokens ON request_logs (tokens);
CREATE INDEX IF NOT EXISTS idx_request_logs_cost ON request_logs (cost);