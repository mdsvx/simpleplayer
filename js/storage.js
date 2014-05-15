define(function() {
   return {
      storeObject : function(key, value) {
         localStorage.setItem(key, JSON.stringify(value));
      },

      retrieveObject : function(key) {
         var value = null;
         if (localStorage !== null) {
            value = localStorage.getItem(key);
            value = JSON.parse(value);
         }
         return value;
      }	  
   };
});
