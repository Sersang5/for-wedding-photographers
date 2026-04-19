DO $$
BEGIN
  IF to_regclass('"Organization"') IS NOT NULL AND to_regclass('organizations') IS NULL THEN
    ALTER TABLE "Organization" RENAME TO organizations;
  END IF;

  IF to_regclass('"User"') IS NOT NULL AND to_regclass('users') IS NULL THEN
    ALTER TABLE "User" RENAME TO users;
  END IF;

  IF to_regclass('"Contact"') IS NOT NULL AND to_regclass('contacts') IS NULL THEN
    ALTER TABLE "Contact" RENAME TO contacts;
  END IF;

  IF to_regclass('"Deal"') IS NOT NULL AND to_regclass('deals') IS NULL THEN
    ALTER TABLE "Deal" RENAME TO deals;
  END IF;

  IF to_regclass('"Activity"') IS NOT NULL AND to_regclass('activities') IS NULL THEN
    ALTER TABLE "Activity" RENAME TO activities;
  END IF;

  IF to_regclass('"AuthSession"') IS NOT NULL AND to_regclass('auth_sessions') IS NULL THEN
    ALTER TABLE "AuthSession" RENAME TO auth_sessions;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'organizations' AND column_name = 'createdAt') THEN
    ALTER TABLE organizations RENAME COLUMN "createdAt" TO created_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'organizations' AND column_name = 'updatedAt') THEN
    ALTER TABLE organizations RENAME COLUMN "updatedAt" TO updated_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'organizationId') THEN
    ALTER TABLE users RENAME COLUMN "organizationId" TO organization_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'firstName') THEN
    ALTER TABLE users RENAME COLUMN "firstName" TO first_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'lastName') THEN
    ALTER TABLE users RENAME COLUMN "lastName" TO last_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'passwordHash') THEN
    ALTER TABLE users RENAME COLUMN "passwordHash" TO password_hash;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'createdAt') THEN
    ALTER TABLE users RENAME COLUMN "createdAt" TO created_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'users' AND column_name = 'updatedAt') THEN
    ALTER TABLE users RENAME COLUMN "updatedAt" TO updated_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'contacts' AND column_name = 'organizationId') THEN
    ALTER TABLE contacts RENAME COLUMN "organizationId" TO organization_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'contacts' AND column_name = 'firstName') THEN
    ALTER TABLE contacts RENAME COLUMN "firstName" TO first_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'contacts' AND column_name = 'lastName') THEN
    ALTER TABLE contacts RENAME COLUMN "lastName" TO last_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'contacts' AND column_name = 'weddingDate') THEN
    ALTER TABLE contacts RENAME COLUMN "weddingDate" TO wedding_date;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'contacts' AND column_name = 'leadStatus') THEN
    ALTER TABLE contacts RENAME COLUMN "leadStatus" TO lead_status;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'contacts' AND column_name = 'ownerUserId') THEN
    ALTER TABLE contacts RENAME COLUMN "ownerUserId" TO owner_user_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'contacts' AND column_name = 'createdAt') THEN
    ALTER TABLE contacts RENAME COLUMN "createdAt" TO created_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'contacts' AND column_name = 'updatedAt') THEN
    ALTER TABLE contacts RENAME COLUMN "updatedAt" TO updated_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'deals' AND column_name = 'organizationId') THEN
    ALTER TABLE deals RENAME COLUMN "organizationId" TO organization_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'deals' AND column_name = 'contactId') THEN
    ALTER TABLE deals RENAME COLUMN "contactId" TO contact_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'deals' AND column_name = 'expectedCloseDate') THEN
    ALTER TABLE deals RENAME COLUMN "expectedCloseDate" TO expected_close_date;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'deals' AND column_name = 'createdAt') THEN
    ALTER TABLE deals RENAME COLUMN "createdAt" TO created_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'deals' AND column_name = 'updatedAt') THEN
    ALTER TABLE deals RENAME COLUMN "updatedAt" TO updated_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'activities' AND column_name = 'organizationId') THEN
    ALTER TABLE activities RENAME COLUMN "organizationId" TO organization_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'activities' AND column_name = 'userId') THEN
    ALTER TABLE activities RENAME COLUMN "userId" TO user_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'activities' AND column_name = 'contactId') THEN
    ALTER TABLE activities RENAME COLUMN "contactId" TO contact_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'activities' AND column_name = 'dealId') THEN
    ALTER TABLE activities RENAME COLUMN "dealId" TO deal_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'activities' AND column_name = 'dueDate') THEN
    ALTER TABLE activities RENAME COLUMN "dueDate" TO due_date;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'activities' AND column_name = 'createdAt') THEN
    ALTER TABLE activities RENAME COLUMN "createdAt" TO created_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'activities' AND column_name = 'updatedAt') THEN
    ALTER TABLE activities RENAME COLUMN "updatedAt" TO updated_at;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'auth_sessions' AND column_name = 'userId') THEN
    ALTER TABLE auth_sessions RENAME COLUMN "userId" TO user_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'auth_sessions' AND column_name = 'organizationId') THEN
    ALTER TABLE auth_sessions RENAME COLUMN "organizationId" TO organization_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'auth_sessions' AND column_name = 'refreshToken') THEN
    ALTER TABLE auth_sessions RENAME COLUMN "refreshToken" TO refresh_token;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'auth_sessions' AND column_name = 'expiresAt') THEN
    ALTER TABLE auth_sessions RENAME COLUMN "expiresAt" TO expires_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'auth_sessions' AND column_name = 'createdAt') THEN
    ALTER TABLE auth_sessions RENAME COLUMN "createdAt" TO created_at;
  END IF;
END $$;

ALTER TABLE weddings
ADD COLUMN IF NOT EXISTS organization_id BIGINT,
ADD COLUMN IF NOT EXISTS state_id BIGINT;

DO $$
DECLARE
  default_org_id BIGINT;
  weddings_count BIGINT;
BEGIN
  SELECT id
  INTO default_org_id
  FROM organizations
  ORDER BY id ASC
  LIMIT 1;

  SELECT COUNT(*)
  INTO weddings_count
  FROM weddings;

  IF weddings_count > 0 AND default_org_id IS NULL THEN
    RAISE EXCEPTION 'Cannot backfill weddings.organization_id because no organizations exist';
  END IF;

  IF default_org_id IS NOT NULL THEN
    UPDATE weddings
    SET organization_id = default_org_id
    WHERE organization_id IS NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS wedding_states (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY,
  organization_id BIGINT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT wedding_states_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS wedding_states_organization_id_code_key ON wedding_states(organization_id, code);
CREATE UNIQUE INDEX IF NOT EXISTS wedding_states_organization_id_name_key ON wedding_states(organization_id, name);
CREATE INDEX IF NOT EXISTS wedding_states_organization_id_sort_order_idx ON wedding_states(organization_id, sort_order);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'wedding_states_organization_id_fkey'
      AND conrelid = 'wedding_states'::regclass
  ) THEN
    ALTER TABLE wedding_states
    ADD CONSTRAINT wedding_states_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

INSERT INTO wedding_states (
  organization_id,
  code,
  name,
  sort_order,
  is_active
)
SELECT
  o.id,
  defaults.code,
  defaults.name,
  defaults.sort_order,
  TRUE
FROM organizations o
CROSS JOIN (
  VALUES
    ('nueva_boda', 'Nueva boda', 1),
    ('espera_informacion', 'A la espera de informacion', 2),
    ('presupuesto_enviado', 'Presupuesto enviado', 3),
    ('reunion_inicial_agendada', 'Reunion inicial agendada', 4),
    ('cierre_contrato', 'Cierre contrato', 5),
    ('reunion_previa', 'Reunion previa', 6),
    ('formulario_boda_pendiente', 'Formulario boda pendiente', 7),
    ('ultimo_pago', 'Ultimo pago', 8),
    ('boda', 'Boda', 9),
    ('entrega_previa', 'Entrega previa', 10),
    ('entrega_final', 'Entrega final', 11)
) AS defaults(code, name, sort_order)
ON CONFLICT (organization_id, code) DO NOTHING;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'weddings'
      AND column_name = 'state'
  ) THEN
    UPDATE weddings w
    SET state_id = ws.id
    FROM wedding_states ws
    WHERE ws.organization_id = w.organization_id
      AND (
        (w.state = '0' AND ws.code = 'nueva_boda')
        OR lower(trim(COALESCE(w.state, ''))) = lower(ws.name)
      );

    WITH org_max AS (
      SELECT
        ws.organization_id,
        COALESCE(MAX(ws.sort_order), 0) AS max_sort_order
      FROM wedding_states ws
      GROUP BY ws.organization_id
    ), missing_states AS (
      SELECT DISTINCT
        w.organization_id,
        trim(w.state) AS raw_state
      FROM weddings w
      WHERE w.state_id IS NULL
        AND w.state IS NOT NULL
        AND btrim(w.state) <> ''
    ), ranked_missing_states AS (
      SELECT
        ms.organization_id,
        ms.raw_state,
        om.max_sort_order + ROW_NUMBER() OVER (
          PARTITION BY ms.organization_id
          ORDER BY ms.raw_state
        ) AS next_sort_order
      FROM missing_states ms
      INNER JOIN org_max om ON om.organization_id = ms.organization_id
    )
    INSERT INTO wedding_states (
      organization_id,
      code,
      name,
      sort_order,
      is_active
    )
    SELECT
      rms.organization_id,
      'legacy_' || md5(rms.raw_state),
      rms.raw_state,
      rms.next_sort_order,
      FALSE
    FROM ranked_missing_states rms
    ON CONFLICT (organization_id, name) DO NOTHING;

    UPDATE weddings w
    SET state_id = ws.id
    FROM wedding_states ws
    WHERE w.state_id IS NULL
      AND ws.organization_id = w.organization_id
      AND ws.name = trim(w.state);
  END IF;
END $$;

UPDATE weddings w
SET state_id = ws.id
FROM wedding_states ws
WHERE w.state_id IS NULL
  AND ws.organization_id = w.organization_id
  AND ws.code = 'nueva_boda';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM weddings WHERE organization_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot set weddings.organization_id to NOT NULL because NULL values still exist';
  END IF;

  IF EXISTS (SELECT 1 FROM weddings WHERE state_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot set weddings.state_id to NOT NULL because NULL values still exist';
  END IF;

  ALTER TABLE weddings
  ALTER COLUMN organization_id SET NOT NULL,
  ALTER COLUMN state_id SET NOT NULL;
END $$;

CREATE INDEX IF NOT EXISTS weddings_organization_id_idx ON weddings(organization_id);
CREATE INDEX IF NOT EXISTS weddings_state_id_idx ON weddings(state_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'weddings_organization_id_fkey'
      AND conrelid = 'weddings'::regclass
  ) THEN
    ALTER TABLE weddings
    ADD CONSTRAINT weddings_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'weddings_state_id_fkey'
      AND conrelid = 'weddings'::regclass
  ) THEN
    ALTER TABLE weddings
    ADD CONSTRAINT weddings_state_id_fkey
    FOREIGN KEY (state_id) REFERENCES wedding_states(id) ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE weddings
DROP COLUMN IF EXISTS state;
