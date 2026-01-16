# Validation Guide

## Global ValidationPipe

Nazoratchi backend'da barcha API endpointlari uchun **Global ValidationPipe** sozlangan. Bu quyidagilarni anglatadi:

### Konfiguratsiya (`src/main.ts`)

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,                    // DTO da yo'q fieldlarni olib tashlaydi
    forbidNonWhitelisted: true,         // Noma'lum fieldlar kelsa 400 xato qaytaradi
    transform: true,                    // Input ma'lumotlarni DTO typega aylantiradi
    transformOptions: {
      enableImplicitConversion: true,   // String -> Number avtomatik konvertatsiya
    },
  }),
);
```

### Qanday ishlaydi?

#### ✅ To'g'ri request:
```bash
POST /api/organizations
Content-Type: application/json

{
  "name": "Qo'qon MTU",
  "code": "QMT",
  "description": "Qo'qon Motor-vagon ta'mirlash zavodi"
}
```

**Natija**: ✅ Success (200 OK)

#### ❌ Noto'g'ri request (noma'lum field):
```bash
POST /api/organizations
Content-Type: application/json

{
  "name": "Qo'qon MTU",
  "code": "QMT",
  "hacker_field": "malicious_value"  ❌
}
```

**Natija**: ❌ Error (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": ["property hacker_field should not exist"],
  "error": "Bad Request"
}
```

#### ❌ Noto'g'ri request (majburiy field yo'q):
```bash
POST /api/organizations
Content-Type: application/json

{
  "name": "Qo'qon MTU"
  // "code" majburiy, lekin yo'q ❌
}
```

**Natija**: ❌ Error (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "code should not be empty",
    "code must be a string"
  ],
  "error": "Bad Request"
}
```

## DTO Coverage

Barcha controllerlarda DTOlar qo'llanilgan:

### Organization Controller
- ✅ `CreateOrganizationDto`
- ✅ `UpdateOrganizationDto`
- ✅ `CreateFacilityDto`
- ✅ `UpdateFacilityDto`
- ✅ `CreateResponsibilityDto`
- ✅ `UpdateResponsibilityDto`

### Plan Controller
- ✅ `CreateAnnualPlanDto`
- ✅ `ApprovePlanDto`
- ✅ `CreateMonthlyPlanDto`
- ✅ `CreatePlanItemDto`
- ✅ `UpdatePlanItemDto`
- ✅ `CompletePlanItemDto`

### Compliance Controller
- ✅ `CreateComplianceItemDto`
- ✅ `CreateComplianceCheckDto`
- ✅ `UpdateComplianceCheckDto`
- ✅ `MarkComplianceDto`

### Inventory Controller
- ✅ `CreateInventoryItemDto`
- ✅ `UpdateInventoryItemDto`
- ✅ `IssueInventoryDto`
- ✅ `ReturnInventoryDto`
- ✅ `DamagedInventoryDto`

## Validation Rules

### Common Validators

```typescript
@IsString()              // String type
@IsNotEmpty()           // Bo'sh bo'lmasligi kerak
@IsOptional()           // Ixtiyoriy field
@IsUUID()               // UUID format
@IsEmail()              // Email format
@IsDateString()         // ISO 8601 date string
@IsInt()                // Integer
@Min(value)             // Minimum qiymat
@Max(value)             // Maximum qiymat
@IsEnum(EnumType)       // Enum qiymat
```

### Example DTO

```typescript
export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;                        // Majburiy

  @IsString()
  @IsNotEmpty()
  code: string;                        // Majburiy

  @IsOptional()
  @IsString()
  description?: string;                 // Ixtiyoriy

  @IsOptional()
  @IsEmail()
  email?: string;                       // Ixtiyoriy, email format

  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';      // Ixtiyoriy, enum
}
```

## Testing Validation

### Manual Test (cURL)

```bash
# To'g'ri request
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"name": "Test Org", "code": "TST"}'

# Noto'g'ri request (validation error kutiladi)
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"name": "Test Org"}'
```

### Expected Validation Errors

| Scenario | HTTP Status | Message |
|----------|-------------|---------|
| Majburiy field yo'q | 400 | `"field should not be empty"` |
| Noto'g'ri type | 400 | `"field must be a string/number/..."` |
| Noma'lum field | 400 | `"property X should not exist"` |
| Noto'g'ri email format | 400 | `"email must be an email"` |
| Noto'g'ri UUID format | 400 | `"field must be a UUID"` |
| Min/Max qiymat | 400 | `"field must not be less/greater than X"` |

## API Key Requirement

**Muhim**: Barcha API endpointlari `ApiKeyGuard` bilan himoyalangan. Har bir requestda `x-api-key` header bo'lishi kerak:

```bash
curl -X GET http://localhost:3000/api/organizations \
  -H "x-api-key: your-secure-api-key-min-16-chars"
```

`.env` faylida `API_KEY` o'zgaruvchisini sozlang:
```
API_KEY=your-secure-api-key-min-16-chars
```

## Production Checklist

- ✅ Global ValidationPipe sozlangan
- ✅ Barcha controller endpointlarida DTOlar qo'llanilgan
- ✅ whitelist: true (keraksiz fieldlar filtrlangan)
- ✅ forbidNonWhitelisted: true (noma'lum fieldlar rad etiladi)
- ✅ transform: true (type conversion)
- ✅ ApiKeyGuard global guard sifatida sozlangan
- ✅ `.env.example` to'liq va izohli

## Keyingi Qadamlar

1. **Unit testlar yozish**: Har bir service uchun
2. **E2E testlar**: API endpointlari uchun validation testlari
3. **Migration infrastructure**: TypeORM migrations sozlash
4. **Core module refactoring**: Domain modullariga ajratish
