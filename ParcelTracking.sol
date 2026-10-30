// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ParcelTracking {
    struct Parcel {
        string trackingId;
        string destination;
        string status;
        bool exists;
    }

    mapping(string => Parcel) private parcels;

    function registerParcel(
        string memory _trackingId,
        string memory _destination
    ) public {
        require(bytes(_trackingId).length > 0, "Enter tracking ID");
        require(!parcels[_trackingId].exists, "Parcel already registered");

        parcels[_trackingId] = Parcel(
            _trackingId,
            _destination,
            "Registered",
            true
        );
    }

    function updateStatus(
        string memory _trackingId,
        string memory _newStatus
    ) public {
        require(parcels[_trackingId].exists, "Parcel not found");
        require(bytes(_newStatus).length > 0, "Enter a status");

        parcels[_trackingId].status = _newStatus;
    }

    function trackParcel(
        string memory _trackingId
    ) public view returns (
        string memory destination,
        string memory status,
        bool exists
    ) {
        Parcel memory p = parcels[_trackingId];
        return (p.destination, p.status, p.exists);
    }
}
