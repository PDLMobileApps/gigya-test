
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        console.log('Device Ready');

        gigyaClient.init('3_emrzRHu7TW8YIcZ9HHQMRLDFZCGE5hDf00J50vH6uV-LpQfr75v1TGNzZ2emG4X5', 'us1.gigya.com');
        
        console.log('Gigya version: ', gigyaClient.getVersion());

        gigyaClient.addEventListener(gigyaClient.Event.LOGIN, function (response) {
            console.log('Gigya login detected: ', response);
        });

        gigyaClient.addEventListener(gigyaClient.Event.LOGOUT, function () {
            console.log('Gigya logout detected');
        });

        $("#socialShare").click(function () {
            if (typeof gigya === "undefined") {
                window.alert("Object 'gigya' not found");
                return;
            }

            var recipePath = "https://www.foodlion.com/content/food-lion/recipes/breakfast-pizza";
            var act = new gigya.socialize.UserAction();

            act.setTitle("Food Lion Recipe");
            act.setSubtitle("Breakfast Pizza");
            act.setDescription("Make your own dough or use store bought pizza dough. Then add your favorite toppings like sweet sausage, vegetables, cheese and eggs. The dough recipe below will make enough for two pizzas. ");
            act.setLinkBack(recipePath);
            act.addActionLink("Food Lion Recipe", recipePath);
            act.addMediaItem({
                src: "https://www.foodlion.com/content/dam/food-lion/recipes/Breakfast Pizza/breakfastpizzamain.jpg",
                href: recipePath,
                type: 'image'
            });

            var params = {
                userAction: act,
                operationMode: "simpleShare",
                context: "recipe-share",
                showEmailButton: false,
                deviceType: "mobile",
                shareTimeout: 5000,
                moreEnabledProviders: "facebook,twitter,pinterest"
            };

            var callbackResponse = {
                onLoad: function (event) {
                    console.log("Recipe Sharing - Load: ", event);
                },
                onError: function (event) {
                    console.log("Recipe Sharing - Error: ", event);
                },
                onDismiss: function (event) {
                    console.log("Recipe Sharing - Dismiss: ", event);
                },
                onClose: function (event) {
                    console.log("Recipe Sharing - Close: ", event);
                },
                onSendDone: function (event) {
                    console.log("Recipe Sharing - SendDone: ", event);
                }
            };

            try {
                // The Cordova SDK opens the share window on iOS.
                // However, it gets closed when a provider is selected without the content being shared.
                gigyaClient.showPlugin('socialize.shareUI', params, callbackResponse);

                // The following does not even open a window on iOS. No error is displayed in the console.log
                //gigya.socialize.showShareUI(params, callbackResponse);
            } catch (error) {
                window.alert('An error occurred');
            }
        });
    }
};

app.initialize();
