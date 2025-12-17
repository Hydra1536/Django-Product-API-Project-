from rest_framework.permissions import BasePermission, SAFE_METHODS


class ProductPermission(BasePermission):
    """
    Product permissions:
    - admin: full access
    - super_staff: full access
    - staff: read-only
    - customer: no access
    """

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        # READ → admin, super_staff, staff
        if request.method in SAFE_METHODS:
            return user.role in ["admin", "super_staff", "staff"]

        # WRITE → admin, super_staff
        return user.role in ["admin", "super_staff"]


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"

class IsAdminOrSuperStaffOrReadOnlyStaff(BasePermission):
    """
    Permissions for user management:
    - admin: full access
    - super_staff: read-only users
    - staff: read-only users
    - customer: no access
    """
    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        if user.role == "admin":
            return True

        if user.role in ["staff", "super_staff"]:
            if request.method == 'GET':
                return True
            
            # Since it's not GET, we check if it's HEAD or OPTIONS 
            # (still needed for proper API client interaction)
            if request.method in ('HEAD', 'OPTIONS'):
                 return True

        return False

# class IsNotCustomer(BasePermission):
#     """
#     Blocks customers completely
#     """
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role != "customer"
