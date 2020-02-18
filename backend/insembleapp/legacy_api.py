import data.category_management as cm
import data.matching as matching
from .legacy_serializers import MatchSerializer, SearchSerializer, CategoryMapSerializer
from .types.matcher import temp_generate_profile_matches, temp_retrieve_profile_matches
import json

from rest_framework import permissions, generics, status
from rest_framework.response import Response


class CategoryMapAPI(generics.GenericAPIView):

    authentication_classes = []
    permission_classes = [
        permissions.AllowAny
    ]

    serializer_class = CategoryMapSerializer

    def get(self, request, *args, **kwargs):
        """

        :return:
        """
        return Response(cm.pull_categories())


# On queue for rename from 'Search' to 'Category'
#
# Viewset for handling search requests. Will pass to backend functions that will be responsible
# for supplying the match


class SearchAPI(generics.GenericAPIView):

    authentication_classes = []
    permission_classes = [
        permissions.AllowAny
    ]

    queryset = []
    serializer_class = SearchSerializer

    def get(self, request, *args, **kwargs):
        """

        Given an ID, searches matches database to retrieve pre-processed matches.

        """
        print(kwargs)
        _id = kwargs.get('_id', None)
        if not _id:
            return Response({'status': "Failed_Request"}, status=status.HTTP_400_BAD_REQUEST)

        # try:
        matches = temp_retrieve_profile_matches(_id)
        return Response(matches, status=status.HTTP_200_OK)
        # except:
        #     return Response({'status': "Failed_Request"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        """

        Post request to accept the information for categories, property criteria, and demographics.
        Request data should come in the following form:

        payload = {
            'categories': ['','',''],  # list of strings
            'target_age': {
                'min': ####,
                'max': ####
            } # integer range seperated by comma
            'target_income': {
                'min': ####,
                'min': ####
            }
            'target_psychographics': ['','',''] list of strings
            'property_criteria': {
                # criteria details
            }
        }

        """
        # Receive and parse the data with a Django provided serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # TODO: Evaluate & store the data in a database to be retrieved by the front_end
        # when required. In the short term, this function will simply return the payload
        # and a 200 OK status.

        try:
            _id = temp_generate_profile_matches(serializer.data)
        except:
            return Response("Failed to generate matches", status=status.HTTP_400_BAD_REQUEST)

        return Response({'_id': _id}, status=status.HTTP_200_OK)


class MatchesAPI(generics.GenericAPIView):

    authentication_classes = []
    permission_classes = [
        permissions.AllowAny
    ]
    queryset = []

    serializer_class = MatchSerializer

    def get(self, request, *args, **kwargs):
        """
        Given an address, returns matches for the user.
        """
        address = kwargs.get('address', None)
        if not address:
            return Response({'status': "Failed_Request"}, status=status.HTTP_400_BAD_REQUEST)

        matches = matching.generate_matches(address)
        matches = json.loads(matches)

        return Response(matches, status=status.HTTP_200_OK)
