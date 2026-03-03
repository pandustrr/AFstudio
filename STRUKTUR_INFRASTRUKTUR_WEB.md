# 📋 DOKUMENTASI STRUKTUR & INFRASTRUKTUR WEB AF STUDIO

## 🎯 OVERVIEW
Website Photography Management System dengan fitur booking, price list, photo editing, dan real-time insights analytics.

---

## 🏗️ TECH STACK

### **Backend**
- **Framework:** Laravel 11
- **PHP Version:** 8.2+
- **Database:** MySQL
- **Authentication:** Laravel Auth (Web, Editor, Photographer)
- **API:** RESTful API dengan Inertia.js

### **Frontend**
- **Framework:** React 18+
- **Build Tool:** Vite
- **UI Framework:** Tailwind CSS
- **Icon Library:** Heroicons
- **Charts:** ApexCharts + React ApexCharts
- **HTTP Client:** Axios (via Inertia)
- **State Management:** React Hooks + Inertia

### **Infrastructure**
- **File Storage:** Local Storage + Google Drive API
- **Queue:** Database Queue
- **Cache:** Database Cache
- **Session:** Database Session
- **Mail:** Log (Development)

---

## 📁 FOLDER STRUCTURE

```
AFstudio-main/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── AboutController.php           # Manage halaman About
│   │   │   │   ├── BookingController.php         # Manage bookings
│   │   │   │   ├── DashboardController.php       # Admin dashboard
│   │   │   │   ├── HomePageController.php        # Manage home page
│   │   │   │   ├── InsightController.php         # Analytics & insights
│   │   │   │   ├── PhotoEditingController.php    # Photo editing management
│   │   │   │   ├── PricelistController.php       # Manage price list
│   │   │   │   ├── PhotographerController.php    # Manage photographers
│   │   │   │   └── ReferralCodeController.php    # Referral system
│   │   │   ├── Api/
│   │   │   │   └── PhotoSelectorController.php   # API untuk photo selector
│   │   │   ├── Public/
│   │   │   │   ├── HomeController.php
│   │   │   │   ├── PageController.php
│   │   │   │   ├── BookingController.php
│   │   │   ├── AuthController.php                 # Authentication
│   │   │   └── ProfileController.php              # Profile management
│   │   └── Middleware/
│   │       └── (Authentication & Authorization)
│   │
│   ├── Models/
│   │   ├── User.php                   # Admin, Editor, Photographer
│   │   ├── About.php                  # About page data
│   │   ├── Booking.php                # Booking data
│   │   ├── BookingItem.php            # Booking items
│   │   ├── Cart.php                   # Shopping cart
│   │   ├── HomePage.php               # Home page content
│   │   ├── HomePageGallery.php        # Gallery images
│   │   ├── JourneyStep.php            # Journey timeline
│   │   ├── Moodboard.php              # About moodboards
│   │   ├── PageView.php               # Page view tracking
│   │   ├── PhotoEditing.php           # Photo editing sessions
│   │   ├── EditRequest.php            # Edit requests
│   │   ├── Review.php                 # Customer reviews
│   │   ├── PricelistCategory.php      # Price list categories
│   │   ├── PricelistSubCategory.php   # Price list sub-categories
│   │   ├── PricelistPackage.php       # Price list packages
│   │   ├── PhotographerSession.php    # Photographer sessions
│   │   ├── PhotographerDateMark.php   # Date marks
│   │   ├── PaymentProof.php           # Payment proofs
│   │   ├── ReferralCode.php           # Referral codes
│   │   ├── Room.php                   # Booking rooms
│   │   └── RoomSchedule.php           # Room schedules
│   │
│   ├── Services/
│   │   └── PhotographerSessionService.php  # Business logic
│   │
│   ├── Traits/
│   │   └── HandledGoogleDrive.php     # Google Drive integration
│   │
│   └── Providers/
│       └── AppServiceProvider.php
│
├── resources/
│   ├── views/                          # (Optional - mostly using React)
│   │
│   └── js/
│       ├── Pages/
│       │   ├── Admin/
│       │   │   ├── About/Index.jsx              # Admin About settings
│       │   │   ├── Insights/Index.jsx           # Analytics dashboard
│       │   │   ├── HomePage/Index.jsx           # Home page settings
│       │   │   ├── Bookings/Index.jsx           # Manage bookings
│       │   │   ├── PhotoEditing/Index.jsx       # Manage photo editing
│       │   │   ├── Pricelist/Index.jsx          # Manage price list
│       │   │   ├── Photographers/Index.jsx      # Manage photographers
│       │   │   └── Reviews/Index.jsx            # Manage reviews
│       │   ├── Public/
│       │   │   ├── Home.jsx                     # Home page
│       │   │   ├── About.jsx                    # About page
│       │   │   ├── Pricelist.jsx                # Price list page
│       │   │   ├── Review.jsx                   # Reviews page
│       │   │   ├── Cart/Create.jsx              # Shopping cart
│       │   │   ├── Checkout/Show.jsx            # Checkout page
│       │   │   └── SelectorPhoto.jsx            # Photo selector
│       │   └── (Other pages)
│       │
│       ├── Components/
│       │   ├── Navbar.jsx                       # Navigation
│       │   ├── ConfirmModal.jsx                 # Confirmation modal
│       │   ├── EditNotif.jsx                    # Notification
│       │   ├── InputLabel.jsx
│       │   ├── TextInput.jsx
│       │   ├── TextArea.jsx
│       │   ├── PrimaryButton.jsx
│       │   └── (Other components)
│       │
│       ├── Layouts/
│       │   ├── AdminLayout.jsx                  # Admin layout
│       │   ├── GuestLayout.jsx                  # Public layout
│       │   └── (Other layouts)
│       │
│       ├── Contexts/                            # React Context
│       │
│       ├── app.jsx                              # App entry point
│       ├── bootstrap.js                         # Bootstrap config
│       └── utils/                               # Utilities
│
├── routes/
│   ├── web.php                         # All routes
│   └── console.php
│
├── database/
│   ├── migrations/                     # Database migrations
│   ├── seeders/                        # Database seeders
│   └── factories/                      # Model factories
│
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── database.php
│   ├── filesystems.php
│   └── (Other configs)
│
├── storage/
│   ├── app/
│   │   ├── google/drive.json          # Google Drive credentials
│   │   └── (File storage)
│   └── logs/
│
├── public/
│   ├── index.php
│   ├── images/
│   ├── favicon_io/
│   └── build/                         # Vite build output
│
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind config
├── package.json                       # Node dependencies
└── composer.json                      # PHP dependencies
```

---

## 🔄 ARCHITECTURE FLOW

### **Authentication Flow**
```
User Login
├── AdminController::login (admin)
├── AuthController::login (editor/photographer)
└── Laravel Auth Guard (web, editor, photographer)
```

### **Booking Flow**
```
User selects package (Pricelist) 
→ Add to Cart 
→ Checkout 
→ Input booking details 
→ Payment proof upload 
→ Admin confirmation 
→ Booking complete
```

### **Photo Editing Flow**
```
Booking created
→ Generate PhotoEditing session (UID)
→ Admin upload RAW photos to Google Drive
→ Customer access via unique UID link
→ Customer requests edits
→ Editor gets edit request
→ Editor uploads to Google Drive
→ Customer downloads edited photos
```

### **Analytics Flow**
```
User visits page 
→ PageView recorded 
→ User interact (click, add cart, etc) 
→ Interaction recorded 
→ Admin views Insights dashboard 
→ Auto-refresh every 30 seconds (real-time)
```

---

## 📊 DATABASE DESIGN

### **Core Tables**

#### **Users**
- id, name, email, password
- role (admin, editor, photographer)
- Timestamps

#### **Bookings**
- id, guest_uid, booking_code, customer_name
- total_price, down_payment, payment_status
- Relationships: hasMany BookingItem, hasOne PaymentProof

#### **BookingItems**
- id, booking_id, pricelist_package_id
- scheduled_date, start_time, end_time
- room_id, status
- Relationships: belongsTo Booking, PricelistPackage

#### **PhotoEditing**
- id, booking_id, uid, customer_name
- raw_folder_id, edited_folder_id (Google Drive)
- status (pending, processing, completed)
- Relationships: hasMany EditRequest

#### **EditRequest**
- id, photo_session_id
- selected_photos (JSON array)
- status (pending, completed)

#### **PageView**
- id, page_name, url, user_id
- device_hash, ip_address, user_agent
- viewed_date, viewed_at

#### **PricelistCategory → PricelistSubCategory → PricelistPackage**
- Hierarchical structure
- name, price, max_editing_quota, is_popular

---

## 🔌 API ENDPOINTS

### **Photo Selector API (Public)**
```
GET    /api/photo-selector/sessions/{uid}              # Get session details
GET    /api/photo-selector/sessions/{uid}/photos       # Get photos from folder
POST   /api/photo-selector/sessions/{uid}/edit-request # Request edit
POST   /api/photo-selector/sessions/{uid}/review       # Submit review
POST   /api/photo-selector/sessions/{uid}/quota-request # Request quota
```

### **Admin Routes**
```
POST   /admin/login                                    # Admin login
GET    /admin/dashboard                                # Dashboard
GET    /admin/about                                    # About settings
POST   /admin/about                                    # Update about
POST   /admin/about/moodboard                          # Add moodboard
DELETE /admin/about/moodboard/{id}                     # Delete moodboard

GET    /admin/insights                                 # Analytics
GET    /admin/insights/page                            # Page details

GET    /admin/bookings                                 # List bookings
GET    /admin/bookings/{id}                            # Booking detail
PATCH  /admin/bookings/{id}                            # Update booking

GET    /admin/photo-editing                            # Photo editing list
GET    /admin/photographers                            # Photographers
GET    /admin/pricelist                                # Price list
```

### **Public Routes**
```
GET    /                                               # Home
GET    /about                                          # About page
GET    /price-list                                     # Price list
GET    /review                                         # Reviews
GET    /cart                                           # Cart

POST   /cart                                           # Add to cart
PATCH  /cart/{id}                                      # Update cart
DELETE /cart/{id}                                      # Remove from cart

GET    /checkout                                       # Checkout page
POST   /checkout                                       # Create booking
POST   /checkout/upload-proof                          # Upload payment proof

GET    /booking/{code}                                 # Booking status
GET    /share/c/{slug}                                 # Shared price list
```

---

## 🛠️ KEY FEATURES & IMPLEMENTATION

### **1. Multi-Role Authentication**
```php
// Guards in config/auth.php
- 'web'          → Admin
- 'editor'       → Photo Editor
- 'photographer' → Photographer

// Middleware for protection
Route::middleware(['auth:web', 'role:admin'])->group(...)
```

### **2. Google Drive Integration**
```php
// Trait: HandledGoogleDrive.php
- getDriveService()           # Initialize Google Drive API
- listPhotosFromFolder()      # List photos
- extractFolderId()           # Extract folder ID from link

// Credentials: storage/app/google/drive.json
```

### **3. Page View Tracking**
```php
// PageView Model
- Track every page visit
- Record: user_id, page_name, url, device_hash, ip_address
- Used for: Analytics, insights, popular pages
```

### **4. Real-Time Analytics**
```javascript
// React useEffect in Insights/Index.jsx
React.useEffect(() => {
    const interval = setInterval(() => {
        router.reload({ only: ['stats'], preserveScroll: true });
    }, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
}, []);
```

### **5. Dynamic Pricing System**
```php
// PricelistPackage Model
- Category → SubCategory → Package (3-tier hierarchy)
- Each package has:
  - name, description, price
  - max_editing_quota (edit limit)
  - is_popular (badge)
  - max_sessions (duration)
```

### **6. Booking Workflow**
```
Cart → Checkout → Payment Proof → Admin Review → Photo Session
```

### **7. Photo Editing Session**
```
Unique UID → Customer Access → Edit Requests → Download Edited Photos
```

---

## 🎨 FRONTEND PATTERNS

### **Component Structure**
```jsx
// Layout → Page → Components

<AdminLayout>
  <Head title="Page Title" />
  <div>
    <Component />
    <Modal />
    <Notification />
  </div>
</AdminLayout>
```

### **Form Handling**
```jsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
  fieldName: ''
});

post('/route', { preserveScroll: true });
```

### **Styling Convention**
```
- Tailwind CSS utility-first
- Color scheme: brand-black, brand-white, brand-red, brand-gold
- Responsive: sm, md, lg, xl breakpoints
- Dark mode: dark: prefix
```

---

## 📦 DEPENDENCIES

### **NPM Packages**
```json
{
  "@inertiajs/react": "^1.0",
  "react": "^18",
  "react-dom": "^18",
  "@heroicons/react": "^2.0",
  "axios": "^1.0",
  "tailwindcss": "^3.0",
  "apexcharts": "^3.0",
  "react-apexcharts": "^1.0"
}
```

### **Composer Packages**
```
laravel/framework
inertiajs/inertia-laravel
google/apiclient
laravel/breeze
laravel/tinker
```

---

## 🔐 SECURITY FEATURES

1. **CSRF Protection** - Built-in Laravel
2. **Authentication** - Multiple guards (admin, editor, photographer)
3. **Authorization** - Role-based access control
4. **Input Validation** - Server-side & client-side
5. **File Upload Validation** - Size & type checks
6. **Google Drive** - Service Account with limited permissions
7. **Session Management** - Database session driver
8. **Password Hashing** - Bcrypt

---

## 📝 DEVELOPMENT WORKFLOW

### **Setup**
```bash
# Clone
git clone <repo>

# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate:fresh --seed

# Google Drive credentials
# Place drive.json in storage/app/google/

# Development server
php artisan serve
npm run dev
```

### **Database Migrations**
```bash
php artisan make:migration create_table_name
php artisan migrate
```

### **Creating Features**
```bash
# Model
php artisan make:model ModelName -m

# Controller
php artisan make:controller Admin/ControllerName

# Seeder
php artisan make:seeder TableNameSeeder
```

---

## 🚀 DEPLOYMENT

### **Environment Variables (.env)**
```
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=afstudio
DB_USERNAME=root
DB_PASSWORD=password

FILESYSTEM_DISK=public
CACHE_DRIVER=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database

GOOGLE_DRIVE_API_KEY=...
```

### **Production Steps**
```bash
# Build frontend
npm run build

# Run migrations
php artisan migrate --force

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Queue worker
php artisan queue:work --daemon
```

---

## 📈 SCALING CONSIDERATIONS

1. **Database Optimization**
   - Add indexes on frequently queried fields
   - Partition large tables
   - Use database query caching

2. **Frontend Optimization**
   - Code splitting with Vite
   - Image optimization
   - Lazy loading

3. **Backend Optimization**
   - Cache frequently accessed data
   - Use queue for long-running tasks
   - Implement rate limiting

4. **Infrastructure**
   - CDN for static assets
   - Load balancing
   - Database replication

---

## 🎓 BEST PRACTICES USED

1. ✅ **MVC Architecture** - Controllers, Models, Views separated
2. ✅ **RESTful API** - Standard HTTP methods
3. ✅ **Component-Based UI** - Reusable React components
4. ✅ **Database Transactions** - For critical operations
5. ✅ **Error Handling** - Try-catch, validation errors
6. ✅ **Code Organization** - Traits, Services, Controllers
7. ✅ **Security** - Input validation, authentication, authorization
8. ✅ **Performance** - Query optimization, caching
9. ✅ **Testing Ready** - Model factories, seeders
10. ✅ **Version Control** - Git workflow

---

## 📞 CONTACT & SUPPORT

- **Documentation:** Check README.md
- **Issues:** GitHub Issues
- **Email:** support@afstudio.com

---

**Last Updated:** 7 Februari 2026
**Version:** 1.0.0
