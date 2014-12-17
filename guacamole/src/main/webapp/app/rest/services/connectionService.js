/*
 * Copyright (C) 2014 Glyptodon LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Service for operating on connections via the REST API.
 */
angular.module('rest').factory('connectionService', ['$http', 'authenticationService',
        function connectionService($http, authenticationService) {
            
    var service = {};
    
    /**
     * Makes a request to the REST API to get a single connection, returning a
     * promise that provides the corresponding @link{Connection} if successful.
     * 
     * @param {String} id The ID of the connection.
     * 
     * @returns {Promise.<Connection>}
     *     A promise which will resolve with a @link{Connection} upon success.
     * 
     * @example
     * 
     * connectionService.getConnection('myConnection').success(function(connection) {
     *     // Do something with the connection
     * });
     */
    service.getConnection = function getConnection(id) {
        return $http.get("api/connection/" + id + "?token=" + authenticationService.getCurrentToken());
    };

    /**
     * Makes a request to the REST API to get the usage history of a single
     * connection, returning a promise that provides the corresponding
     * array of @link{ConnectionHistoryEntry} objects if successful.
     * 
     * @param {String} id
     *     The identifier of the connection.
     * 
     * @returns {Promise.<ConnectionHistoryEntry[]>}
     *     A promise which will resolve with an array of
     *     @link{ConnectionHistoryEntry} objects upon success.
     */
    service.getConnectionHistory = function getConnectionHistory(id) {
        return $http.get("api/connection/" + id + "/history?token=" + authenticationService.getCurrentToken());
    };

    /**
     * Makes a request to the REST API to get the parameters of a single
     * connection, returning a promise that provides the corresponding
     * map of parameter name/value pairs if successful.
     * 
     * @param {String} id
     *     The identifier of the connection.
     * 
     * @returns {Promise.<Object.<String, String>>}
     *     A promise which will resolve with an map of parameter name/value
     *     pairs upon success.
     */
    service.getConnectionParameters = function getConnectionParameters(id) {
        return $http.get("api/connection/" + id + "/parameters?token=" + authenticationService.getCurrentToken());
    };

    /**
     * Makes a request to the REST API to save a connection, returning a
     * promise that can be used for processing the results of the call. If the
     * connection is new, and thus does not yet have an associated identifier,
     * the identifier will be automatically set in the provided connection
     * upon success.
     * 
     * @param {Connection} connection The connection to update.
     *                          
     * @returns {Promise}
     *     A promise for the HTTP call which will succeed if and only if the
     *     save operation is successful.
     */
    service.saveConnection = function saveConnection(connection) {
        
        // If connection is new, add it and set the identifier automatically
        if (!connection.identifier) {
            return $http.post("api/connection/?token=" + authenticationService.getCurrentToken(), connection).success(

                // Set the identifier on the new connection
                function setConnectionID(connectionID){
                    connection.identifier = connectionID;
                }

            );
        }
        
        // Otherwise, update the existing connection
        else {
            return $http.post(
                "api/connection/" + connection.identifier + 
                "?token=" + authenticationService.getCurrentToken(), 
            connection);
        }

    };
    
    /**
     * FIXME: Why is this different from save?
     * 
     * Makes a request to the REST API to move a connection to a different
     * group, returning a promise that can be used for processing the results
     * of the call.
     * 
     * @param {Connection} connection The connection to move. 
     *                          
     * @returns {Promise}
     *     A promise for the HTTP call which will succeed if and only if the
     *     move operation is successful.
     */
    service.moveConnection = function moveConnection(connection) {
        
        return $http.put(
            "api/connection/" + connection.identifier + 
            "?token=" + authenticationService.getCurrentToken() + 
            "&parentID=" + connection.parentIdentifier, 
        connection);
        
    };
    
    /**
     * Makes a request to the REST API to delete a connection,
     * returning a promise that can be used for processing the results of the call.
     * 
     * @param {Connection} connection The connection to delete.
     *                          
     * @returns {Promise}
     *     A promise for the HTTP call which will succeed if and only if the
     *     delete operation is successful.
     */
    service.deleteConnection = function deleteConnection(connection) {
        return $http['delete'](
            "api/connection/" + connection.identifier + 
            "?token=" + authenticationService.getCurrentToken());
    };
    
    return service;
}]);
