# Bharat Darpan / Live News Template

यह एक **multipage Hindi news website template** है जिसमें:

- Home + category pages (राष्ट्रीय, अंतरराष्ट्रीय, खेल, मनोरंजन, टेक)
- Admin panel (`docs/admin.html`) to add/delete news
- LocalStorage based lightweight CMS (backend के बिना demo के लिए)

## Run locally

```bash
python3 -m http.server 8000
```

फिर खोलें: `http://localhost:8000/docs/`

## Important

Production use के लिए नीचे की चीज़ें जोड़ें:

- Login/Auth for admin
- Database + server API
- Image upload/CDN
- SEO meta tags + sitemap
