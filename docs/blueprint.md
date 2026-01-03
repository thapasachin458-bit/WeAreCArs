# **App Name**: WeAreCars Rental Manager

## Core Features:

- Staff Authentication: Secure staff login using fixed credentials (Username: sta001, Password: givemethekeys123) with Firebase Authentication.
- Booking Form: Interactive form to input customer details, booking options, and optional extras with real-time price calculation. Validates mandatory fields: Customer First Name, Customer Surname, Customer Address, Customer Age (numeric, ≥ 18), Valid Driving License (Yes/No), Number of Days (1-28), Type of Car, Fuel Type. Blocks booking without a driving license.  Displays tooltips and helper text.
- Price Calculation: Automatically calculates total cost based on base rental (£25/day), car type surcharge, fuel surcharge, and optional extras (Unlimited Mileage: +£10/day, Breakdown Cover: +£2/day). Dynamically updates the total price.  Base rental, Car type surcharge, Fuel surcharge, Optional extras.
- Booking Summary: Displays a comprehensive summary of all entered booking details and a full cost breakdown for confirmation. It includes Confirm Booking and Cancel/Edit buttons.
- Booking Storage: Saves booking data to Firestore including customer details, booking options, total price, and timestamp. It enforces data validation to prevent invalid or incomplete bookings.
- Rented Cars List: Presents a list of all stored bookings in a table or card layout, including Customer name, Car type, Days booked, Total price, and Booking date.
- Admin-Style Dashboard: A simple dashboard shows how many active bookings there are. It uses an AI tool to estimate the number of cars the firm will need over the next month, and suggests if fleet growth would be a good investment.

## Style Guidelines:

- Primary color: Dark blue (#34495E), reflecting trust and professionalism suitable for car rentals.
- Background color: Light gray (#F0F3F4), provides a clean, neutral backdrop that ensures readability and focuses attention on the content.
- Accent color: Teal (#008080), highlights interactive elements, buttons, and key information to guide users effectively.
- Body and headline font: 'Inter', a grotesque-style sans-serif, ensures readability and provides a modern aesthetic.
- Use car-related icons for navigation and booking options to enhance user experience.
- Responsive layout adapts seamlessly across devices, providing optimal viewing experience.
- Subtle transitions and animations on form elements and confirmations to provide feedback to the user.