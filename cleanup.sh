#!/bin/bash

echo "====================================="
echo "   KOLEGIUM CLEANUP SCRIPT - FULL    "
echo "====================================="
echo ""

# 1. Hapus Controllers
echo "[1/8] Menghapus Controllers..."
rm app/Http/Controllers/{AddressController,AnalyzerController,CourierController,CourierRateController,CustomerController,DashboardController,ExpenseController,MidtransController,OrderController,OrderItemController,OrderPaymentController,OriginSettingController,PaymentBankController,ProductController,ProductSettingController,ProductVariantController,ReportController,SalesChannelController,ShippingController,StockMovementController,StockOpnameController,WebOrderController,WilayahController,XenditController}.php
echo "✓ Controllers dihapus"

# 2. Hapus Models
echo "[2/8] Menghapus Models..."
rm app/Models/{Courier,CourierRate,Customer,CustomerAddress,Expense,Order,OrderAuditLog,OrderItem,OrderPayment,OriginSetting,PaymentBank,Product,ProductSetting,ProductVariant,SalesChannel,Shipping,StockMovement,StockOpname,StockOpnameDetail,Voucher,Wilayah}.php
echo "✓ Models dihapus"

# 3. Hapus React Pages
echo "[3/8] Menghapus React Pages..."
rm -rf resources/js/Pages/{Checkout,Customer,Marketplace,Order,Product,Report,StockMovement,StockOpname,Voucher}
rm resources/js/Pages/{Dashboard,Expense,Home}.jsx
echo "✓ React Pages dihapus"

# 4. Hapus Settings Pages
echo "[4/8] Menghapus Settings Pages..."
rm resources/js/Pages/Settings/{ApiSettings,CourierRates,CourierSettings,CustomerSettings,DashboardSettings,GeneralSettings,OrderSettings,OriginSettings,PaymentSettings,ProductSettings,TemplateSettings}.jsx
echo "✓ Settings Pages dihapus"

# 5. Hapus Migrations (kecuali users, roles, sessions, cache, tokens, jobs)
echo "[5/8] Menghapus Migrations..."
rm database/migrations/2024_03_20_000000_create_customers_table.php
rm database/migrations/2024_03_20_000002_create_payment_banks_table.php
rm database/migrations/2024_03_20_000004_create_couriers_table.php
rm database/migrations/2024_03_20_000004_create_products_table.php
rm database/migrations/2024_03_20_000005_create_product_variants_table.php
rm database/migrations/2024_03_20_000006_create_courier_rates_table.php
rm database/migrations/2024_03_20_000007_create_stock_movements_table.php
rm database/migrations/2024_03_20_000008_create_stock_opnames_table.php
rm database/migrations/2024_03_20_000009_create_stock_opname_details_table.php
rm database/migrations/2024_03_20_000010_create_customer_addresses_table.php
rm database/migrations/2024_03_20_000011_create_orders_table.php
rm database/migrations/2024_03_20_000011_create_sales_channels_table.php
rm database/migrations/2024_03_20_000012_add_sales_channel_id_to_orders_table.php
rm database/migrations/2024_03_20_000012_create_order_items_table.php
rm database/migrations/2024_03_20_000013_create_order_payments_table.php
rm database/migrations/2024_03_20_000017_create_shippings_table.php
rm database/migrations/2025_08_03_164821_create_vouchers_table.php
rm database/migrations/2025_08_03_164830_create_expenses_table.php
rm database/migrations/2025_08_03_164837_add_voucher_fields_to_orders_table.php
rm database/migrations/2025_08_13_110240_add_updated_by_to_orders_table.php
rm database/migrations/2025_08_13_161321_add_updated_by_deleted_by_to_payment_banks_table.php
rm database/migrations/2025_08_13_170930_add_updated_by_deleted_by_to_stock_opnames_table.php
rm database/migrations/2025_08_13_171004_add_audit_columns_to_stock_opname_details_table.php
rm database/migrations/2025_09_01_172334_update_orders_table_for_guest_checkout.php
rm database/migrations/2025_09_01_182448_enhance_courier_rates_table.php
rm database/migrations/2025_09_02_181222_add_weight_to_products_and_variants_tables.php
rm database/migrations/2025_09_02_183543_add_audit_columns_to_product_variants_table.php
rm database/migrations/2025_09_03_171657_create_wilayah_table.php
rm database/migrations/2025_09_03_174425_add_created_by_to_customers_table.php
rm database/migrations/2025_09_03_185608_add_image_and_storefront_to_products_table.php
rm database/migrations/2025_09_04_000000_add_missing_columns_to_customers_table.php
rm database/migrations/2025_09_04_134101_create_order_audit_logs_table.php
rm database/migrations/2025_09_05_090627_add_base_price_to_order_items_table.php
rm database/migrations/2025_09_06_114202_create_product_settings_table.php
rm database/migrations/2025_09_06_114232_create_origin_settings_table.php
rm database/migrations/2025_09_06_140000_add_code_to_couriers_table.php
rm database/migrations/2025_10_08_070929_add_cost_to_couriers_table.php
rm database/migrations/2025_10_20_000000_remove_base_price_from_products.php
rm database/migrations/2025_10_21_000000_add_base_price_to_product_variants.php
rm database/migrations/2025_10_28_094626_add_image_to_product_variants_table.php
echo "✓ Migrations dihapus"

# 6. Hapus Seeders (kecuali users, roles, database)
echo "[6/8] Menghapus Seeders..."
rm database/seeders/{CourierSeeder,CustomerSeeder,ExpenseSeeder,OrderSeeder,PaymentBankSeeder,ProductSeeder,SalesChannelSeeder,StockMovementSeeder,StockOpnameSeeder,VoucherSeeder,WilayahSeeder}.php
echo "✓ Seeders dihapus"

# 7. Hapus HTTP Requests (kecuali User dan Role)
echo "[7/8] Menghapus HTTP Requests..."
rm -rf app/Http/Requests/{Address,Courier,CourierRate,Customer,CustomerAddress,Order,OrderItem,OrderPayment,PaymentBank,Product,ProductVariant,SalesChannel,Shipping,StockMovement,StockOpname,StockOpnameDetail}
echo "✓ HTTP Requests dihapus"

# 8. Hapus Enums (kecuali UserRole)
echo "[8/11] Menghapus Enums..."
rm app/Enums/{OrderStatus,PaymentStatus,StockMovementType,StockOpnameStatus}.php
echo "✓ Enums dihapus"

# 9. Hapus Services
echo "[9/11] Menghapus Services..."
rm -rf app/Services
echo "✓ Services dihapus"

# 10. Hapus Jobs
echo "[10/11] Menghapus Jobs..."
rm -rf app/Jobs
echo "✓ Jobs dihapus"

# 11. Hapus Traits
echo "[11/11] Menghapus Traits..."
rm -rf app/Traits
echo "✓ Traits dihapus"

# 12. Hapus file tambahan
echo "Menghapus file tambahan..."
rm -f sales_management wilayah.sql postman_collection.json
echo "✓ File tambahan dihapus"

echo ""
echo "====================================="
echo "       CLEANUP SELESAI!              "
echo "====================================="
echo ""
echo "File yang DIPERTAHANKAN:"
echo "✓ Controllers: Auth, User, Role"
echo "✓ Models: User, Role"
echo "✓ Migrations: users, roles, sessions, cache, tokens, jobs"
echo "✓ Seeders: User, Role, Database"
echo "✓ Requests: User, Role"
echo "✓ Pages: Auth, Settings (User & Role only)"
echo ""
echo "Langkah selanjutnya:"
echo "1. Review database/seeders/DatabaseSeeder.php"
echo "2. php artisan migrate:fresh"
echo "3. php artisan db:seed"
echo "4. npm run build"
echo "5. Test aplikasi"
echo ""