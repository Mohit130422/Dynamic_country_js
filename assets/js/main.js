(() => {
    'use strict';

    Array.prototype.sortAZ = function () {
        return this.sort(function (a, b) {
            var x = a.toLowerCase();
            var y = b.toLowerCase();
            if (x > y) {
                return 1;
            }
            if (x < y) {
                return -1;
            }
            return 0;
        });
    }

    Array.prototype.sortZA = function () {
        return this.sort(function (a, b) {
            var x = a.toLowerCase();
            var y = b.toLowerCase();
            if (x > y) {
                return -1;
            }
            if (x < y) {
                return 1;
            }
            return 0;
        });
    }

    Array.prototype.makeSelectBox = function (id, placeholderText) {
        const placeholderOption = `<option value="placeholder">${placeholderText}</option>`;

        document.getElementById(`${id}`).innerHTML = '';
        document.getElementById(`${id}`).innerHTML = placeholderOption;

        return this.forEach(elem => {
            const options = `<option value="${elem}">${elem}</option>`;
            document.getElementById(`${id}`).innerHTML += options;
        });
    }

    const uniqueData = () => {
        const getUnique = (elem, index, arr) => {
            return arr.indexOf(elem) === index && elem !== '';
        }
        const services = Object.freeze({
            getUnique
        });
        return services;
    }
    const unique_region = uniqueData();


    const regions_box = document.querySelector('#regions');
    const subRegions_Box = document.querySelector('#sub_regions');
    const countries_SelectBox = document.querySelector('#countries');


    const getCountryData = Object.freeze({
        method: 'get',
        url: 'https://restcountries.com/v3.1/all',
        responseType: 'json'
    });


    axios(getCountryData).then(response => {
        const countries = response.data;
        console.log(countries);
        const regionsLists = countries.map(elem => elem.region).filter(unique_region.getUnique).sortAZ();
        const subregionsLists = countries.map(elem => elem.subregion).filter(unique_region.getUnique).sortAZ();
        const countriesListing = countries.map(elem => elem.name.common.common).filter(unique_region.getUnique).sortAZ();

        regionsLists.makeSelectBox('regions', 'Select Regions');
        subregionsLists.makeSelectBox('sub_regions', 'Select Sub-Regions');
        countriesListing.makeSelectBox('countries', 'Select Country');

        subRegions_Box.setAttribute('disabled', true);
        countries_SelectBox.setAttribute('disabled', true);

        const table = `<table class="table" id="country_data">
        <thead>
            <tr>            
                <th scope="col">Region</th>
                <th scope="col">Sub Region</th>
                <th scope="col" style="width: 150px;">Flag</th>
                <th scope="col">Country Name</th>
                <th scope="col">Capital</th>
                <th scope="col">Population</th>              
            </tr>
        </thead>
        <tbody id="countries_table_data"></tbody>          
        </table>`;

        document.getElementById('countries_container').innerHTML = table;

    }).catch(err => {

        console.log(err);

    }).then(() => {

        $('#loader').fadeOut(600);

    });


    regions_box.addEventListener('change', function () {
        $('loader').show();

        const activeRegion = this.options[this.selectedIndex].value;

        axios(getCountryData).then(response => {
            const countries = response.data;

            const filteredData = countries.filter(elem => elem.region === activeRegion);

            const filteredCountiresArray = filteredData.map(elem => elem.name.common).sortAZ();
            filteredCountiresArray.makeSelectBox('countries', 'Select Country');

            const filteredSubRegions = filteredData.map(elem => elem.subregion).filter(unique_region.getUnique).sortAZ();
            filteredSubRegions.makeSelectBox('sub_regions', 'Select Sub Regions');

            subRegions_Box.removeAttribute('disabled');

            document.getElementById('countries_table_data').innerHTML = '';
            filteredData.forEach(elem => {
                document.getElementById('countries_table_data').innerHTML += `<tr>
                <td>${elem.region}</td>
                <td>${elem.subregion}</td>
                <td><img src="${elem.coatOfArms.png}" class="img-fluid country-image"></td>
                <td>${elem.name.common}</td>
                <td>${elem.capital}</td>
                <td>${elem.population}</td>                           
                </tr>`;
            });

            $('#loader').fadeOut(600);
        });
    });

    subRegions_Box.addEventListener('change', function () {

        $('#loader').show();

        const activeSubRegion = this.options[this.selectedIndex].value;

        axios(getCountryData).then(response => {
            const countries = response.data;

            const filteredData = countries.filter(elem => elem.subregion === activeSubRegion);
            const filteredCountries = filteredData.map(elem => elem.name.common).filter(unique_region.getUnique).sortAZ();
            filteredCountries.makeSelectBox('countries', 'Select Country');

            countries_SelectBox.removeAttribute('disabled');

            document.getElementById('countries_table_data').innerHTML = '';
            filteredData.forEach(elem => {
                document.getElementById('countries_table_data').innerHTML += `<tr>
                <td>${elem.region}</td>
                <td>${elem.subregion}</td>
                <td><img src="${elem.coatOfArms.png}" class="img-fluid country-image"></td>
                <td>${elem.name.common}</td>
                <td>${elem.capital}</td>
                <td>${elem.population}</td>                           
                </tr>`;
            });

            $('#loader').fadeOut(600);

        });

    });

    countries_SelectBox.addEventListener('change', function () {

        $('#loader').show();

        const activeCountry = this.options[this.selectedIndex].value;

        axios(getCountryData).then(response => {
            const countries = response.data;

            const filteredData = countries.filter(elem => elem.name.common === activeCountry);

            document.getElementById('countries_table_data').innerHTML = '';
            filteredData.forEach(elem => {
                document.getElementById('countries_table_data').innerHTML += `<tr>
                <td>${elem.region}</td>
                <td>${elem.subregion}</td>
                <td><img src="${elem.coatOfArms.png}" class="img-fluid country-image"></td>
                <td>${elem.name.common}</td>
                <td>${elem.capital}</td>
                <td>${elem.population}</td>                           
                </tr>`;
            });

            $('#loader').fadeOut(600);

        });
    });
    
})();

