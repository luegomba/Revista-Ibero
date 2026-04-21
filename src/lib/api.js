import axios from 'axios';

// URL base del backend de Strapi
export const STRAPI_URL = 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api`;

// Función para obtener todos los posts (con imágenes y contenido)
export const fetchPosts = async () => {
    const res = await axios.get(`${API_URL}/posts?populate=*`);
    return res.data.data;
};

// Función para obtener todas las revistas ordenadas por número descendente
export const fetchRevistas = async () => {
    const res = await axios.get(
        `${API_URL}/revistas?populate=portada&sort=numero:desc`
    );
    return res.data.data;
};

// Función para obtener la última revista publicada (número más alto)
export const fetchLatestRevista = async () => {
    const res = await axios.get(
        `${API_URL}/revistas?populate=portada&sort=numero:desc&pagination[limit]=1`
    );
    return res.data.data?.[0] ?? null;
};