# ParagonR

### Description

This is a demo of an application using Firebase and Vertex AI to scan receipts and convert the images to editable forms. This way you can track your spending by just taking a photo of your bill.

**Note**: This app was tested mostly on Polish style receipts. Still it can be use for any other receipts with good results.

### Demo: [https://paragon-r.web.app](https://paragon-r.web.app)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Firebase

To make app working correctly on your machine you will need to setup firebase project. Since it is using `@angular/fire` visit docs for more information.

[https://www.npmjs.com/package/@angular/fire](https://www.npmjs.com/package/@angular/fire)

firebase app config is should be store in `src/environments/environment.ts`

**Important** Firebase project need to have enable VertexAI and Storage to work correctly.
