package com.wolftalk.backend.controller;

import org.apache.http.client.fluent.Request;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.wolftalk.backend.constant.Iconstant;

public class GoogleLogin {

        /**
         * Exchange authorization code for access token
         * 
         * @param code Authorization code from Google OAuth
         * @return Access token
         * @throws Exception if HTTP request fails
         */
        public String getToken(String code) throws Exception {
                String url = Iconstant.GOOGLE_LINK_GET_TOKEN;

                String body = "client_id=" + Iconstant.GOOGLE_CLIENT_ID
                                + "&client_secret=" + Iconstant.GOOGLE_CLIENT_SECRET
                                + "&code=" + code
                                + "&grant_type=" + Iconstant.GOOGLE_GRANT_TYPE
                                + "&redirect_uri=" + Iconstant.GOOGLE_REDIRECT_URI;

                String response = Request.Post(url)
                                .bodyString(body, org.apache.http.entity.ContentType.APPLICATION_FORM_URLENCODED)
                                .execute()
                                .returnContent()
                                .asString();
                JsonObject jsonObject = new Gson().fromJson(response, JsonObject.class);
                return jsonObject.get("access_token").getAsString();
        }
}
