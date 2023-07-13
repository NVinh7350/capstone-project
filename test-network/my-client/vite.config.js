import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from "dotenv";
dotenv.config();
const frontEndHost = process.env.FRONT_END_HOST || '192.168.1.10';
const frontEndPort = process.env.FRONT_END_PORT || 5173
export default defineConfig({
  plugins: [react()],
  server: {
    host: frontEndHost,
    port: frontEndPort
  }
})
