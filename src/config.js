module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin:dunder@localhost/allowance',
    TEST_DB_URL: process.env.TEST_DATABASE_URL || 'postgresql://dunder_mifflin:dunder@localhost/allowance-test',
    JWT_SECRET: process.env.JWT_SECRET || 'little-brother-name-christopher',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '10m'
}